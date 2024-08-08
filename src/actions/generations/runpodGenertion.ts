"use server";
import { Generate } from "@/app/schema/generate";
import { fetchKvStore } from "@/lib/vercel-kv";
import axios, { AxiosError } from "axios";
import { db, queryDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/next-auth.options";
import { images, prompts } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { uploadMultipleFiles } from "@/lib/s3";
import {
  IMagicScriptArgs,
  IProjectPrompt,
} from "@/modules/project/types/common.types";
import { updatedCreditBalance } from "@/controllers/credit.controller";
import {
  DEFAULT_PROMPT_MIN_CREDIT,
  MAGIC_PROMPT_MIN_CREDIT,
} from "@/utils/CONSTANTS";
import { getBlurHashBase64 } from "@/utils/fn.backend";
import { pusherServer } from "@/lib/pusher";
import { PUSHER_CHANNELS, PUSHER_EVENTS } from "@/utils/pusher.constants";

export async function runpodGeneration({
  id,
  body,
}: {
  id: string;
  body: Generate;
}) {
  const isPlayground = id === "playground";
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("No user found");
  }
  // Get user ID
  if (!sessionUser.id) {
    throw new Error("No user ID found");
  }
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

    const defaultPrompt = settings.value.defaultPrompt;
    const defaultNegativePrompt = settings.value.defaultNegativePrompt;
    // Generate new prompt
    const newPrompt = `${defaultPrompt} ${body.prompt} ${settings.value.primaryCheckpoint}`;
    // Generate new negative prompt
    const newNegativePrompt = `${body.negativePrompt} ${defaultNegativePrompt}`;

    // Generate payload
    const inputPayload = {
      api_name: "txt2img",
      prompt: newPrompt,
      seed: body.seed,
      sampler_index: body.elephantModel,
      steps: body.quality ?? 10,
      cfg_scale: body.cfg ?? 0,
      negative_prompt: newNegativePrompt,
      batch_size: body.numberOfImages ?? 1,
      height: body.height ?? 512,
      width: body.width ?? 512,
    };

    const script_args: IMagicScriptArgs = [
      7,
      body.xAxis || "", // x axix values
      [],
      body.yAxis ? 7 : 0,
      body.yAxis || "", // y axis values
      [],
      body.zAxis ? 7 : 0,
      body.zAxis || "", // z axis values
      [],
      true, // drawLegend
      "False", // includeLoneImages
      "False", // includeSubGrids
      "True", // noFixedSeeds
      1, // marginSize
      "False", // csvMode
    ];
    const generatePayload = isMagicPrompt
      ? {
          input: {
            ...inputPayload,
            script_name: "x/y/z plot",
            script_args: script_args,
          },
        }
      : { input: { ...inputPayload } };

    // Generate image
    let response;
    try {
      response = await axios(modelEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RUNPOD_API_TOKEN}`,
        },
        data: generatePayload,
      });
      if (response?.data?.status === "FAILED") {
        console.log("RUNPOD IMAGE GENERATION FAILED", response?.data?.output);
        throw new Error("RUNPOD IMAGE GENERATION FAILED");
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log(
        `RUNPOD IMAGE GENERATION FAILED - STATUS_CODE: ${error?.response?.status} - MESSAGE: ${error.message}`
      );
      throw new Error("RUNPOD IMAGE GENERATION FAILED");
    }
    if (!response?.data?.output?.images) {
      console.log(
        `RUNPOD IMAGE GENERATION - STATUS: ${response?.data?.status}`,
        response?.data?.output
      );
      throw new Error("RUNPOD IMAGE GENERATION FAILED");
    }

    // parse the info
    const info = JSON.parse(response.data.output.info);
    const all_prompts: string[] = info?.all_prompts || [];
    const all_seeds: number[] = info?.all_seeds || [];
    const executionTime: number = response.data.executionTime || 0;
    // const timeTaken = (executionTime - delayTime) / 1000;
    const timeTaken = executionTime / 1000;

    // key - {user-id}/{project-id}/{sub-project-id}
    const saveKey = `${sessionUser.id}/${subProject.projectId}/${subProject.id}`;

    // Create Image Buffer
    const s3Images = response.data.output.images?.map((image: any) => {
      const imageBuffer = Buffer.from(image, "base64");
      return {
        key: `${saveKey}/${uuidv4()}.png`,
        body: imageBuffer,
        contentType: "image/png",
      };
    });

    if (!s3Images) {
      console.log("runpod reponse with empty images array");
      throw new Error("runpod reponse with empty images array");
    }

    // Upload images
    const uploadedImages = await uploadMultipleFiles(
      process.env.R2_UPLOAD_BUCKET,
      s3Images
    );

    if (!uploadedImages?.length) {
      console.log("Image upload to R2 bucket failed");
      throw new Error("Image upload to R2 bucket failed");
    }

    // Save prompt
    const prompt = await db.insert(prompts).values({
      apiName: body.elephantBrain,
      prompt: body.prompt,
      defaultPrompt: defaultPrompt,
      negativePrompt: body.negativePrompt,
      defaultNegativePrompt: defaultNegativePrompt,
      original_seed: body.seed,
      samplerIndex: body.elephantModel,
      steps: body.quality,
      cfgScale: body.cfg,
      batchSize: body.numberOfImages,
      height: body.height,
      width: body.width,
      subProjectId: subProject.id,
      s3ImageBucketKey: saveKey,
      type: isMagicPrompt ? "MAGIC" : "DEFAULT",
      script_args: isMagicPrompt ? script_args : null,
      userId: sessionUser.id,
    });

    if (!prompt) {
      console.log("Error saving the prompt in database");
      throw new Error("Error saving the prompt in database");
    }

    // Save images to DB
    for (let i = 0; i < s3Images.length; i++) {
      const index = isMagicPrompt ? i - 1 : i;
      const tempIndex = index < 0 ? 0 : index; // @temp fix to accomodate duplicate images in magic prompt
      const image_prompt = all_prompts[tempIndex]; // @todo - use {i} instead
      const image_seed = all_seeds[tempIndex]; // @todo - use {i} instead
      const image = s3Images[i];
      const s3Url = `${process.env.R2_ENDPOINT}/${image.key}`;
      const blurHash = await getBlurHashBase64(s3Url);
      // Save images to DB
      await db.insert(images).values({
        userId: sessionUser.id,
        imageUrl: s3Url,
        promptId: +prompt[0].insertId,
        isActive: true,
        blurHash,
        generated_seed: image_seed || generatePayload.input.seed,
        generated_prompt: image_prompt || generatePayload.input.prompt,
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

    // update user's credit balance
    await updatedCreditBalance(timeTaken, sessionUser.id, {
      elephantBrain: brain,
      numberOfImages: isMagicPrompt
        ? uploadedImages.length - 2
        : body.numberOfImages,
      generationType: isMagicPrompt ? "MAGIC" : "DEFAULT",
      elephantStyle: body.elephantModel,
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
    return updatedPrompt as IProjectPrompt;
  } catch (error) {
    console.log(
      `API: /api/generate/{id} Image Generation Error: ${
        (error as Error)?.message
      }`
    );
    throw error;
  }
}
