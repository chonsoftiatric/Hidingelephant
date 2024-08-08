"use server";

import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/next-auth.options";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { IVectorizeOptions } from "@/schemas/vectorize/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { vectorize_images } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "@/lib/s3";

type ConverImgaeToVectorInput = {
  url: string;
  options?: IVectorizeOptions;
};
export const convertImageToVector = async ({
  url,
  options,
}: ConverImgaeToVectorInput) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!sessionUser) {
    throw new Error("unauthorized");
  }
  const response = await axios.post(API_ROUTES.VECTORIZE.API_URL, {
    url,
    ...options,
  });
  return response.data;
};

export const getSubProjectVectorizedImages = async ({
  subProjectId,
}: {
  subProjectId: string | number;
}) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("unauthorized");
  }

  const allVectorizedImages = await db.query.vectorize_images.findMany({
    where: and(
      eq(vectorize_images.userId, sessionUser.id),
      eq(vectorize_images.subProjectId, +subProjectId)
    ),
  });
  return allVectorizedImages;
};

type SaveVectorizedImageInput = {
  subProjectId: string | number;
  form: FormData;
};

export const saveVectorizedImageToProject = async ({
  subProjectId,
  form,
}: SaveVectorizedImageInput) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  const file = form.get("file") as File;
  const imageId = Number(form.get("imageId")) as number;
  const saveKey = form.get("saveKey") as string;
  if (!sessionUser) {
    throw new Error("unauthorized");
  }

  const isPlayground = subProjectId === "playground";
  const parsedId = +subProjectId;
  if (isNaN(parsedId) && !isPlayground) {
    throw new Error("Invalid sub project id");
  }
  let id = parsedId;
  if (isPlayground) {
    const playgroundProject = await db.query.subProjects.findFirst({
      where: (subProjects, { eq }) => eq(subProjects.userId, sessionUser.id),
    });
    if (!playgroundProject) {
      throw new Error("Playground not found");
    }
    id = playgroundProject.id;
  }

  if (!file || !saveKey || !imageId) {
    throw new Error("validation failed");
  }

  // const saveKey = `${sessionUser.id}/${projectId}/${subProjectId}/vector`;
  const bucket = process.env.R2_UPLOAD_BUCKET as string;
  const key = `${saveKey}/vector/${uuidv4()}.svg`;
  const arrayBuffer = await file.arrayBuffer();
  const contentType = file.type;
  await uploadFile(bucket, key, arrayBuffer as Buffer, contentType);
  const fileUrl = `${process.env.R2_ENDPOINT}/${key}`;

  await db.insert(vectorize_images).values({
    image_url: fileUrl,
    imageId: imageId,
    userId: sessionUser.id,
    subProjectId: id,
  });
  return fileUrl;
};

export const vectorizeImageWithAI = async ({
  imageUrl,
}: {
  imageUrl: string;
}) => {
  const formData = new FormData();
  formData.set("image.url", imageUrl);
  formData.set("mode", "test");

  const response = await axios.post(
    "https://api.vectorizer.ai/api/v1/vectorize",
    formData,
    {
      auth: {
        username: "vkhjgi4if2m8rrf",
        password: "j4e59mcm0l9cftvd9burk52i5kicgguktr5oejn4pb7eim0lrun6",
      },
    }
  );
  return response.data;
};
