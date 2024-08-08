"use server";

import { uploadFile } from "@/lib/s3";
import { authOptions } from "@/utils/next-auth.options";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";

type UploadImageInput = {
  data: FormData;
};
export const uploadImageToR2 = async ({ data }: UploadImageInput) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  const file = data.get("file") as File;
  if (!sessionUser) {
    throw new Error("Unauthorized");
  }
  const bucket = process.env.R2_UPLOAD_BUCKET as string;
  const key = `${sessionUser.id}/user/${uuidv4()}-${file.name}`;
  const arrayBuffer = await file.arrayBuffer();
  const contentType = file.type;
  await uploadFile(bucket, key, arrayBuffer as Buffer, contentType);
  const fileUrl = `${process.env.R2_ENDPOINT}/${key}`;
  return fileUrl;
};
