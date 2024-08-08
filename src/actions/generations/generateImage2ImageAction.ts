"use server";
import { img2imgFormDataSchema } from "@/app/schema/img2img.schema";
import { db } from "@/lib/db";
import { fetchKvStore } from "@/lib/vercel-kv";
import { authOptions } from "@/utils/next-auth.options";
import axios from "axios";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { uploadFile, uploadMultipleFiles } from "@/lib/s3";
import { updatedCreditBalance } from "@/controllers/credit.controller";
import { images, prompts } from "@/lib/db/schema";
import { DALL_E_MODEL, DEFAULT_PROMPT_MIN_CREDIT } from "@/utils/CONSTANTS";
import { getBlurHashBase64 } from "@/utils/fn.backend";
import { IDallEResponseData } from "@/types/project.types";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { IPrompt, Image } from "@/types/db.schema.types";
import { pusherServer } from "@/lib/pusher";
import { PUSHER_CHANNELS, PUSHER_EVENTS } from "@/utils/pusher.constants";

type GenerateImage2ImageActionParams = {
  data: FormData;
  subProjectId: string;
  imageId?: string;
};
export const generateImage2ImageAction = async ({
  data,
  subProjectId,
  imageId = "",
}: GenerateImage2ImageActionParams) => {
  const body = img2imgFormDataSchema.parse(data);
  const isDALL_E = body.elephantBrain === DALL_E_MODEL;
  const isGV = body.elephantBrain === "GV";
  if (isGV) {
    return;
  }
  let basePrompt = "";

  let isSketch = false;
  if (!imageId) {
    isSketch = true;
  }

  const parsedSubProjectId = parseInt(subProjectId, 10);
  if (isNaN(parsedSubProjectId)) {
    return;
  }

  try {
    if (!process.env.R2_UPLOAD_BUCKET) {
      console.log("R2 upload bucket env variable not found");
      return;
    }
    if (!process.env.R2_ENDPOINT) {
      console.log("R2 endpoint env variable not found");
      return;
    }
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    if (!sessionUser?.id) {
      return;
    }
    const parsedImageId = parseInt(imageId, 10);
    if (imageId) {
      if (isNaN(parsedImageId)) {
        return;
      }

      const image = (await db.query.images.findFirst({
        where: (images, { eq }) => eq(images.id, parsedImageId),
        with: {
          prompt: true,
        },
      })) as Image & { prompt: IPrompt };

      if (!image) {
        return;
      }

      basePrompt = image.prompt.prompt;
      // check if image belong to sessionUser
      if (image?.userId !== sessionUser.id) {
        return;
      }
    }

    // find the sub-project by parsedSubProjectId
    const subProject = await db.query.subProjects.findFirst({
      where: (subProjects, { eq }) => eq(subProjects.id, parsedSubProjectId),
    });
    if (!subProject) return;

    const imageKey = `${subProject.userId}/${subProject.projectId}/${subProject.id}`;

    if (!imageKey) {
      return;
    }

    const creditInfo = await db.query.credit.findFirst({
      where: (credit, { eq }) => eq(credit.userId, sessionUser.id),
    });
    if (!creditInfo) {
      console.log(`Credit information not found for user: ${sessionUser.id}`);
      return;
    }

    const remainingCredits = creditInfo.remainingCredits || 0;

    // credit balance check
    if (remainingCredits < DEFAULT_PROMPT_MIN_CREDIT) {
      return;
    }

    // Fetch endpoints
    const endpoint = await fetchKvStore("model-endpoints");
    // Check if endpoint exists
    if (endpoint?.key !== "model-endpoints") {
      console.log(
        "Model endpoints not found in redis database KEY: model-endpoints"
      );
      return;
    }
    // Fetch Settings
    const settings = await fetchKvStore("kv-model-settings");
    // Check if settings exists
    if (settings?.key !== "kv-model-settings") {
      console.log("No model settings found KEY: kv-model-settings");
      return;
    }

    // Get model endpoint
    const modelEndpoint = endpoint.value[body.elephantBrain];
    const brain = Object.keys(endpoint.value).find(
      (item) => item === body.elephantBrain
    );

    if (!modelEndpoint) {
      // Check if model endpoint exists
      console.log(`No model endpoint found for Brain: ${body.elephantBrain}`);
      return;
    }

    const defaultPrompt = isDALL_E
      ? settings.value.defaultDallEPrompt
      : settings.value.defaultPrompt;
    const defaultNegativePrompt = isDALL_E
      ? settings.value.defaultDallENegativePrompt
      : settings.value.defaultNegativePrompt;

    // Generate new prompt
    const newPrompt = `${defaultPrompt} ${body.prompt} ${
      isDALL_E ? "" : settings.value.primaryCheckpoint
    }`;
    // Generate new negative prompt
    const newNegativePrompt = `${body.negativePrompt} ${defaultNegativePrompt}`;

    // Generate payload
    const inputPayload = {
      input: {
        api_name: "img2img",
        prompt: newPrompt,
        seed: body.seed,
        sampler_index: body.elephantModel,
        steps: body.quality,
        cfg_scale: body.cfg,
        negative_prompt: newNegativePrompt,
        batch_size: body.numberOfImages,
        height: body.height,
        width: body.width,
        init_images: [body.initImage],
        mask_image: body.maskImage ? [body.maskImage] : undefined,
      },
    };
    const saveKey = imageKey;
    let sketchImageUrl = undefined;
    if (isSketch) {
      const mimeMap: Record<string, string> = {
        "image/jpeg": "jpeg",
        "image/png": "png",
      };
      // upload the parent image to s3
      const parentImageBase64 = body.initImage;
      const response = await fetch(parentImageBase64);
      const blob = await response.blob();
      const extension = mimeMap[blob.type];
      if (!extension) {
        return;
      }
      const buffer = await blob.arrayBuffer();
      const key = `${saveKey}/${uuidv4()}.${mimeMap[blob.type]}`;
      // @ts-ignore
      await uploadFile(process.env.R2_UPLOAD_BUCKET, key, buffer, blob.type);
      sketchImageUrl = `${process.env.R2_ENDPOINT}/${key}`;
    }

    const token = isDALL_E
      ? process.env.OPENAI_API_KEY
      : process.env.RUNPOD_API_TOKEN;

    const dall_e_endpoint = body.maskImage
      ? API_ROUTES.OPENAI_API.edits
      : API_ROUTES.OPENAI_API.variations;

    const before = performance.now();
    // Generate Img2Img
    let response;
    try {
      const imageResponse = await axios({
        method: "get",
        url: body.initImage,
        responseType: "arraybuffer",
      });
      imageResponse.data.name = "image.png";
      const imageBuffer = Buffer.from(imageResponse.data, "binary");
      const imageBlob = new Blob([imageBuffer], { type: "image/png" });

      const dall_e_payload = new FormData();
      dall_e_payload.append("model", "dall-e-2");
      dall_e_payload.append("n", body.numberOfImages.toString());
      dall_e_payload.append("size", "512x512");
      dall_e_payload.append("image", imageBlob);
      if (body.maskImage) {
        dall_e_payload.append("prompt", newPrompt);
        const imageResponse = await axios({
          method: "get",
          url: body.maskImage,
          responseType: "arraybuffer",
        });
        imageResponse.data.name = "mask.png";
        const imageBuffer = Buffer.from(imageResponse.data, "binary");
        const imageBlob = new Blob([imageBuffer], { type: "image/png" });
        dall_e_payload.append("mask", imageBlob);
      }
      const payload = isDALL_E ? dall_e_payload : inputPayload;
      const apiEndpoint = isDALL_E ? dall_e_endpoint : modelEndpoint;

      const requestBody = {
        method: "POST",
        headers: {
          "Content-Type": isDALL_E ? "multipart/form-data" : "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: payload,
      };

      response = await axios(apiEndpoint, requestBody);

      if (response?.data?.status === "FAILED") {
        return;
      }
    } catch (err) {
      const error = err as any;
      const errors = error?.response?.data?.error;
      console.log(errors);
      console.log(
        `IMG2IMG GENERATION FAILED - STATUS_CODE: ${error?.response?.status} - MESSAGE: ${error.message}`
      );
      return;
    }

    const elapsed = performance.now() - before; // milliseconds
    const manualTimeTaken = Math.floor(elapsed) / 1000; // seconds

    // parse the info
    const info = isDALL_E ? null : JSON.parse(response.data.output.info);
    const all_seeds: number[] = info ? info?.all_seeds : [];
    let executionTime: number = response.data.executionTime || 0;
    // const timeTaken = (executionTime - delayTime) / 1000;

    const timeTaken = isDALL_E ? manualTimeTaken : executionTime / 1000;

    const dallEReponse: IDallEResponseData = response.data;
    const generatedImages = isDALL_E
      ? await Promise.all(
          dallEReponse.data.map(async (item) => {
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
        )
      : response.data.output.images?.map((image: any) => {
          const imageBuffer = Buffer.from(image, "base64");
          return {
            key: `${saveKey}/${uuidv4()}.png`,
            body: imageBuffer,
            contentType: "image/png",
          };
        });

    if (!generatedImages) {
      console.log(`RUNPOD IMG2IMG GENERATION FAILED`);
      return;
    }

    // Upload images
    const uploadedImages = await uploadMultipleFiles(
      process.env.R2_UPLOAD_BUCKET,
      generatedImages
    );

    if (!uploadedImages?.length) {
      console.log("Image upload to R2 bucket failed");
      return;
    }

    // Save prompt
    const prompt = await db.insert(prompts).values({
      apiName: body.elephantBrain,
      prompt: body.prompt || basePrompt,
      defaultPrompt: defaultPrompt,
      negativePrompt: body.negativePrompt,
      defaultNegativePrompt: defaultNegativePrompt,
      original_seed: body.seed,
      samplerIndex: isDALL_E ? DALL_E_MODEL : body.elephantModel,
      steps: body.quality,
      cfgScale: body.cfg,
      batchSize: body.numberOfImages,
      height: body.height,
      width: body.width,
      subProjectId: parsedSubProjectId,
      s3ImageBucketKey: saveKey,
      type: "IMG2IMG",
      userId: sessionUser.id,
      parentImageId: isNaN(parsedImageId) ? undefined : parsedImageId,
      sketchImageUrl,
    });

    if (!prompt) {
      console.log("Error saving the prompt in database");
      return;
    }

    // Save images to DB
    const imagesPromise = generatedImages.map(
      async (s3Image: any, i: number) => {
        const image_seed = all_seeds[i];
        const image = s3Image;
        const s3Url = `${process.env.R2_ENDPOINT}/${image.key}`;
        const blurHash = await getBlurHashBase64(s3Url);

        await db.insert(images).values({
          userId: sessionUser.id,
          imageUrl: s3Url,
          promptId: +prompt[0].insertId,
          isActive: true,
          blurHash,
          generated_seed: image_seed,
          generated_prompt: "",
          updatedAt: new Date(),
          createdAt: new Date(),
        });
      }
    );
    await Promise.all(imagesPromise);

    const updatedPrompt = await db.query.prompts.findFirst({
      where: (prompts, { eq }) => eq(prompts.id, +prompt[0].insertId),
      with: {
        images: {
          with: {
            subProjectBookmark: true,
          },
        },
        parentImage: {
          with: {
            subProjectBookmark: true,
            feedImage: true,
          },
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
    await updatedCreditBalance(timeTaken, sessionUser.id, {
      elephantBrain: brain,
      elephantStyle: isGV || isDALL_E ? undefined : body.elephantModel,
      numberOfImages: body.numberOfImages,
      generationType: isSketch ? "SKETCH" : "SIMILAR",
    });

    return updatedPrompt;
  } catch (error) {
    console.log(error);
    console.log(`IMG2IMG Generation Error: ${(error as Error)?.message}`);
    return;
  }
};
