import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

export const s3 = new S3Client({
  region: "auto",
  endpoint: "https://80d3ad3546c01dd07745fdcec204d7f1.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_R2 ?? "",
    secretAccessKey: process.env.ACCESS_SECRET_R2 ?? "",
  },
});

export async function uploadFile(
  bucket: string,
  key: string,
  body: Buffer,
  contentType: string
) {
  const compressedBuffer = await sharp(body)
    .resize({ width: 512, height: 512 })
    .toFormat("png", {
      quality: 85,
    })
    .toBuffer();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: contentType.includes("png") ? compressedBuffer : body,
    ContentType: contentType,
  });

  try {
    const response = await s3.send(command);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function checkIfBucketExists(bucket: string) {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
  });

  try {
    const response = await s3.send(command);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function checkIfObjectExists(bucket: string, key: string) {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: key,
  });

  try {
    const response = await s3.send(command);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadMultipleFiles(
  bucket: string,
  files: { key: string; body: Buffer; contentType: string }[]
) {
  try {
    const response = await Promise.all(
      files.map((file) =>
        uploadFile(bucket, file.key, file.body, file.contentType)
      )
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function createBucketIfNotExists(bucket: string) {
  const command = new CreateBucketCommand({
    Bucket: bucket,
  });

  try {
    const response = s3.send(command);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createBucketAndUploadFiles(
  bucket: string,
  files: { key: string; body: Buffer; contentType: string }[]
) {
  try {
    await createBucketIfNotExists(bucket);
    const response = await uploadMultipleFiles(bucket, files);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getObjects(bucket: string) {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
  });

  try {
    const response = await s3.send(command);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getObject(bucket: string, key: string) {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: key,
  });

  try {
    const response = await s3.send(command);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
