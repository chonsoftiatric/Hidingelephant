"use server";
import { db } from "@/lib/db";
import { canvas } from "@/lib/db/schema";
import { authOptions } from "@/utils/next-auth.options";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export const getCanvasById = async (id: string) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("Unauthenticated");
  }

  if (!id) {
    throw new Error("Invalid Canvas Id");
  }

  const canvasRes = await db.query.canvas.findFirst({
    where: (canvas, { eq }) => eq(canvas.id, +id),
    with: {
      subProject: {
        with: {
          prompts: true,
        },
      },
    },
  });

  if (!canvasRes) {
    throw new Error("Canvas not found");
  }
  // @ts-ignore
  const subProject = canvasRes?.subProject;
  if (!subProject) {
    throw new Error("Sub-project not found");
  }

  // @ts-ignore
  const prompt = subProject?.prompts[0] as IPrompt;

  if (canvasRes.subProject.userId !== sessionUser.id) {
    throw new Error("Not allowed to update canvas for this sub-project");
  }
  return {
    canvas: canvasRes,
    bucketKey: prompt.s3ImageBucketKey,
  };
};

export const updateCanvasById = async (id: string, payload: any) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("Unauthenticated");
  }
  const canvasId = +id;
  if (typeof canvasId !== "number") {
    throw new Error("Invalid Canvas Id");
  }
  const canvasData = await db.query.canvas.findFirst({
    where: (canvas, { eq }) => eq(canvas.id, canvasId),
    with: {
      subProject: true,
    },
  });

  if (canvasData?.subProject.userId !== sessionUser.id) {
    throw new Error("Not allowed to update canvas for this sub-project");
  }

  const body = payload;
  await db
    .update(canvas)
    .set({
      nodeSchema: body,
    })
    .where(eq(canvas.id, +id));
  return canvasId;
};
