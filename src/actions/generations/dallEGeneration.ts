"use server";
import { Generate } from "@/app/schema/generate";
import { fetchKvStore } from "@/lib/vercel-kv";
import axios from "axios";
import { db, queryDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/next-auth.options";
import { images, prompts } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { uploadMultipleFiles } from "@/lib/s3";
import { updatedCreditBalanceDirect } from "@/controllers/credit.controller";
import { DALL_E_MODEL, DEFAULT_PROMPT_MIN_CREDIT } from "@/utils/CONSTANTS";
import { getBlurHashBase64 } from "@/utils/fn.backend";
import { IDallEResponseData } from "@/types/project.types";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { pusherServer } from "@/lib/pusher";
import { PUSHER_CHANNELS, PUSHER_EVENTS } from "@/utils/pusher.constants";
import { IProjectPrompt } from "@/modules/project/types/common.types";

export const dallEGeneration = async ({
  id,
  body,
}: {
  id: string;
  body: Generate;
}) => {
  const session = await getServerSession(authOptions);

  const sessionUser = session?.user;

  if (!sessionUser) {
    throw new Error("No session user found");
  }
  // Get user ID
  if (!sessionUser.id) {
    throw new Error("No user ID found");
  }
  const isPlayground = id === "playground";
  const parsedId = +id;
  if (isNaN(parsedId) && !isPlayground) {
    throw new Error("Invalid sub project id");
  }
  let subProjectId = parsedId;
  if (isPlayground) {
    const playgroundProject = await db.query.subProjects.findFirst({
      where: (subProjects, { eq }) => eq(subProjects.userId, sessionUser.id),
    });
    if (!playgroundProject) {
      throw new Error("Playground not found");
    }
    subProjectId = playgroundProject.id;
  }

  try {
    // run env checks
    if (!process.env.R2_UPLOAD_BUCKET) {
      console.log("R2 upload bucket env variable not found");
      throw new Error("R2 upload bucket env variable not found");
    }
    if (!process.env.R2_ENDPOINT) {
      console.log("R2 endpoint env variable not found");
      throw new Error("R2 endpoint env variable not found");
    }

    const creditInfo = await db.query.credit.findFirst({
      where: (credit, { eq }) => eq(credit.userId, sessionUser.id),
    });
    if (!creditInfo) {
      console.log(`Credit information not found for user: ${sessionUser.id}`);
      throw new Error("Credit information not found");
    }

    const remainingCredits = creditInfo.remainingCredits || 0;

    // credit balance check
    if (remainingCredits < DEFAULT_PROMPT_MIN_CREDIT) {
      throw new Error(
        `Insuffient credit balance: ${creditInfo.remainingCredits}, minimum ${DEFAULT_PROMPT_MIN_CREDIT} credits required`
      );
    }

    const subProject = await queryDB.query.subProjects.findFirst({
      where: (subProject, { eq }) => eq(subProject.id, subProjectId),
    });
    if (!subProject) {
      throw new Error("Sub Project not found");
    }

    // Fetch Settings
    const settings = await fetchKvStore("kv-model-settings");
    // Check if settings exists
    if (settings?.key !== "kv-model-settings") {
      console.log("No model settings found KEY: kv-model-settings");
      throw new Error("No model settings found");
    }

    const defaultPrompt = settings.value.defaultDallEPrompt;
    const defaultNegativePrompt = settings.value.defaultDallENegativePrompt;
    // update user prompt
    const newPrompt = `${defaultPrompt} ${body.prompt}`; //
    // update user negative prompt
    const newNegativePrompt = `${body.negativePrompt} ${defaultNegativePrompt}`;

    // key - {user-id}/{project-id}/{sub-project-id}
    const saveKey = `${sessionUser.id}/${subProject.projectId}/${subProject.id}`;

    // Generate image
    let predictions: IDallEResponseData["data"] = [];
    const start = performance.now();
    try {
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is missing");
      }
      const response = await axios<IDallEResponseData>(
        API_ROUTES.OPENAI_API.generation,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          data: {
            model: "dall-e-2",
            prompt: newPrompt,
            n: body.numberOfImages,
            size: "1024x1024",
            quality: "standard", // depends on model
          },
        }
      );

      const data = response.data;
      if (data.data) {
        predictions = data.data;
      }
    } catch (err) {
      const error = err as any;
      const errors = error?.response?.data?.error;
      console.log(errors);
      console.log(`OPENAI DALL-E IMAGE GENERATION FAILED`, error);
      throw new Error("OPENAI DALL-E IMAGE GENERATION FAILED");
    }
    const end = performance.now();
    const timeTaken = end - start;
    if (predictions?.length === 0) {
      console.log(`DALL-E NO GENERATIONS`);
      throw new Error("DALL-E NO GENERATIONS");
    }

    if (!predictions?.length) {
      console.log("NO GENERATION");
      throw new Error("NO GENERATION");
    }

    const R2IMAGES = await Promise.all(
      predictions?.map(async (item) => {
        const response = await axios({
          method: "get",
          url: item.url,
          responseType: "arraybuffer",
        });
        // Convert image data to a buffer
        const buffer = Buffer.from(response.data, "binary");
        return {
          key: `${saveKey}/${uuidv4()}.png`,
          body: buffer,
          contentType: "image/png",
        };
      })
    );
    if (!R2IMAGES) {
      console.log("DALL-E RESPONSE WITH EMPTY IMAGES ARRAY");
      throw new Error("DALL-E RESPONSE WITH EMPTY IMAGES ARRAY");
    }

    // Upload images
    const uploadedImages = await uploadMultipleFiles(
      process.env.R2_UPLOAD_BUCKET,
      R2IMAGES
    );

    if (!uploadedImages?.length) {
      console.log("IMAGE UPLOAD TO R2 BUCKET FAILED");
      throw new Error("IMAGE UPLOAD TO R2 BUCKET FAILED");
    }

    // Save prompt
    const prompt = await db.insert(prompts).values({
      apiName: body.elephantBrain,
      prompt: predictions[0]?.revised_prompt || body.prompt,
      defaultPrompt: defaultPrompt,
      negativePrompt: body.negativePrompt,
      defaultNegativePrompt: defaultNegativePrompt,
      original_seed: body.seed,
      samplerIndex: DALL_E_MODEL,
      steps: 0,
      cfgScale: body.cfg,
      batchSize: predictions.length,
      height: 1024,
      width: 1024,
      subProjectId: subProject.id,
      s3ImageBucketKey: saveKey,
      userId: sessionUser.id,
    });

    if (!prompt) {
      console.log("Error saving the prompt in database");
      throw new Error("Error saving the prompt in database");
    }

    // Save images to DB
    for (let i = 0; i < R2IMAGES.length; i++) {
      const image = R2IMAGES[i];
      const s3Url = `${process.env.R2_ENDPOINT}/${image.key}`;
      const blurHash = await getBlurHashBase64(s3Url);
      // Save images to DB
      await db.insert(images).values({
        userId: sessionUser.id,
        imageUrl: s3Url,
        promptId: +prompt[0].insertId,
        isActive: true,
        blurHash,
        generated_seed: body.seed + i,
        generated_prompt: newPrompt,
        updatedAt: new Date(),
        createdAt: new Date(),
      });
    }

    const updatedPrompt = await queryDB.query.prompts.findFirst({
      where: (prompts, { eq }) => eq(prompts.id, +prompt[0].insertId),
      with: {
        images: {
          with: {
            subProjectBookmark: true,
            feedImage: true,
          },
        },
        parentImage: {
          subProjectBookmark: true,
          feedImage: true,
        },
      },
    });

    if (subProject.visibility === "PUBLIC") {
      try {
        await pusherServer.trigger(
          PUSHER_CHANNELS.GENERATIONS,
          PUSHER_EVENTS.IMAGE_GENERATED,
          {
            prompt: updatedPrompt,
          }
        );
        console.log("pusher event triggered");
      } catch (err) {
        console.log("Error sending pusher event", err);
      }
    }

    // update user's credit balance
    await updatedCreditBalanceDirect(
      uploadedImages.length,
      sessionUser.id,
      {
        elephantBrain: "DALL-E",
        numberOfImages: body.numberOfImages,
        generationType: "DEFAULT",
      },
      timeTaken
    );
    return updatedPrompt as IProjectPrompt;
  } catch (error) {
    console.log(
      `API: /api/generations/dall-e/{id} Image Generation Error: ${
        (error as Error)?.message
      }`
    );
    throw error;
  }
};
