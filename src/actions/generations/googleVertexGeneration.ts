"use server";
import { Generate, generateSchema } from "@/app/schema/generate";
import { fetchKvStore } from "@/lib/vercel-kv";
import axios, { AxiosError } from "axios";
import { db, queryDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/next-auth.options";
import { NextRequest } from "next/server";
import { images, prompts } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { uploadMultipleFiles } from "@/lib/s3";
import { updatedCreditBalanceDirect } from "@/controllers/credit.controller";
import {
  CFG_SCALE_VAL,
  DEFAULT_PROMPT_MIN_CREDIT,
  MAGIC_PROMPT_MIN_CREDIT,
} from "@/utils/CONSTANTS";
import { getBlurHashBase64 } from "@/utils/fn.backend";
import { gcloudToken } from "@/utils/generate/gcloudToken";
import { pusherServer } from "@/lib/pusher";
import { PUSHER_CHANNELS, PUSHER_EVENTS } from "@/utils/pusher.constants";
import { IProjectPrompt } from "@/modules/project/types/common.types";

export async function googleVertexGeneration({
  id,
  body,
}: {
  id: string;
  body: Generate;
}) {
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
    const isMagicPrompt = body.xAxis ? true : false;

    // credit balance check
    if (!isMagicPrompt && remainingCredits < DEFAULT_PROMPT_MIN_CREDIT) {
      throw new Error(
        `Insuffient credit balance: ${creditInfo.remainingCredits}, minimum ${DEFAULT_PROMPT_MIN_CREDIT} credits required`
      );
    }
    if (isMagicPrompt && remainingCredits < MAGIC_PROMPT_MIN_CREDIT) {
      throw new Error(
        `Insuffient credit balance: ${creditInfo.remainingCredits}, minimum ${MAGIC_PROMPT_MIN_CREDIT} credits required`
      );
    }

    const subProject = await queryDB.query.subProjects.findFirst({
      where: (subProject, { eq }) => eq(subProject.id, subProjectId),
    });
    if (!subProject) {
      throw new Error("Sub Project not found");
    }

    // Fetch endpoints
    const endpoint = await fetchKvStore("model-endpoints");

    // Check if endpoint exists
    if (endpoint?.key !== "model-endpoints") {
      console.log(
        "Model endpoints not found in redis database KEY: model-endpoints"
      );
      throw new Error("Model endpoints not found in redis database");
    }

    // Fetch Settings
    const settings = await fetchKvStore("kv-model-settings");
    // Check if settings exists
    if (settings?.key !== "kv-model-settings") {
      console.log("No model settings found KEY: kv-model-settings");
      throw new Error("No model settings found");
    }

    // Get model endpoint
    const modelEndpoint = endpoint.value[body.elephantBrain];
    const brain = Object.keys(endpoint.value).find(
      (item) => item === body.elephantBrain
    );

    if (!modelEndpoint) {
      // Check if model endpoint exists
      console.log(`No model endpoint found for Brain: ${body.elephantBrain}`);
      throw new Error("No model endpoint found");
    }

    const defaultPrompt = settings.value.defaultGVPrompt;
    const defaultNegativePrompt = settings.value.defaultGVNegativePrompt;

    // update user prompt
    const newPrompt = `${defaultPrompt} ${body.prompt}`;
    // update user negative prompt
    const newNegativePrompt = `${body.negativePrompt} ${defaultNegativePrompt}`;

    const payload = {
      instances: [
        {
          prompt: newPrompt,
        },
      ],
      parameters: {
        sampleCount: body.numberOfImages,
        guidanceScale:
          body.cfg === CFG_SCALE_VAL.low
            ? "low"
            : body.cfg === CFG_SCALE_VAL.medium
            ? "medium"
            : "high",
        negativePrompt: newNegativePrompt,
        seed: body.seed,
      },
    };

    // Generate image
    let predictions = [];
    const start = performance.now();
    try {
      const token = await gcloudToken();
      if (!token) {
        throw new Error("Token generation failed");
      }
      const response = await axios(modelEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: payload,
      });

      const data = response.data;
      if (data?.predictions) {
        predictions = data.predictions;
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log(
        `GOOGLE VERTEX IMAGE GENERATION FAILED`,
        error?.response?.data
      );
      throw new Error("GOOGLE VERTEX IMAGE GENERATION FAILED");
    }
    const end = performance.now();
    const timeTaken = end - start;
    if (predictions?.length === 0) {
      console.log(`GOOGLE VERTEX 0 IMAGE GENERATED`);
      throw new Error("GOOGLE VERTEX 0 IMAGE GENERATED");
    }

    // key - {user-id}/{project-id}/{sub-project-id}
    const saveKey = `${sessionUser.id}/${subProject.projectId}/${subProject.id}`;

    // Create Image Buffer
    const R2IMAGES = predictions?.map((item: any) => {
      const imageBuffer = Buffer.from(item.bytesBase64Encoded, "base64");
      return {
        key: `${saveKey}/${uuidv4()}.png`,
        body: imageBuffer,
        contentType: "image/png",
      };
    });

    if (!R2IMAGES) {
      console.log("GOOGLE VERTEX RESPONSE WITH EMPTY IMAGES ARRAY");
      throw new Error("GOOGLE VERTEX RESPONSE WITH EMPTY IMAGES ARRAY");
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
      prompt: body.prompt,
      defaultPrompt,
      defaultNegativePrompt,
      negativePrompt: body.negativePrompt,
      original_seed: body.seed,
      samplerIndex: "GV",
      steps: 0,
      cfgScale: body.cfg,
      batchSize: body.numberOfImages,
      height: body.height,
      width: body.width,
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
        elephantBrain: brain,
        numberOfImages: uploadedImages.length,
        generationType: "DEFAULT",
      },
      timeTaken
    );
    return updatedPrompt as IProjectPrompt;
  } catch (error) {
    console.log(
      `API: /api/VERTEX/{id} Image Generation Error: ${
        (error as Error)?.message
      }`
    );
    throw error;
  }
}
