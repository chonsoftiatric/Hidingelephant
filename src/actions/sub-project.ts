"use server";

import { db, queryDB } from "@/lib/db";
import { subProjects } from "@/lib/db/schema";
import { ISubProjectByIdResponseModel } from "@/modules/project/types/api.response.types";
import { PromptWithMetadata } from "@/types/db.types";
import { authOptions } from "@/utils/next-auth.options";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { v4 } from "uuid";

export const shareSubProject = async (subProjectId: number) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("Unauthenticated");
  }
  const subProject = await db.query.subProjects.findFirst({
    where: (subProjects, { eq }) => eq(subProjects.id, subProjectId),
  });
  if (!subProject) {
    throw new Error("Sub project not found");
  }
  if (subProject.userId !== sessionUser.id) {
    throw new Error("You are not the owner of this sub project");
  }

  // check if already have a share hash
  if (subProject.shareHash) {
    throw new Error("Already shared");
  }

  const shareHash = v4();
  await db
    .update(subProjects)
    .set({
      shareHash,
    })
    .where(eq(subProjects.id, subProjectId));
  return {
    shareHash,
    url: `${process.env.NEXTAUTH_URL}/p/${subProjectId}/${shareHash}`,
  };
};
export type ShareSubProjectResponse = Awaited<
  ReturnType<typeof shareSubProject>
>;

export const toggleShareStatusRequest = async (subProjectId: number) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("Unauthenticated");
  }
  const subProject = await db.query.subProjects.findFirst({
    where: (subProjects, { eq }) => eq(subProjects.id, subProjectId),
  });
  if (!subProject) {
    throw new Error("Sub project not found");
  }
  if (subProject.userId !== sessionUser.id) {
    throw new Error("You are not the owner of this sub project");
  }

  // check if have a share hash - if not throw error
  if (!subProject.shareHash) {
    throw new Error("Sub project not shared");
  }
  const isShared = !subProject.isShared;

  await db
    .update(subProjects)
    .set({
      isShared: isShared,
    })
    .where(eq(subProjects.id, subProjectId));
  return {
    isShared,
  };
};

type GetSharedSubProject = {
  subProjectId: number;
  hash: string;
};
export const getSharedSubProject = async ({
  hash,
  subProjectId,
}: GetSharedSubProject) => {
  const subProject = await db.query.subProjects.findFirst({
    where: (subProjects, { eq }) => eq(subProjects.id, subProjectId),
    with: {
      prompts: {
        with: {
          images: {
            subProjectBookmark: true,
            feedImage: true,
          },
          parentImage: {
            subProjectBookmark: true,
            feedImage: true,
          },
        },
      },
    },
  });
  if (!subProject) {
    throw new Error("Sub project not found");
  }
  // check if have a share hash - if not throw error
  if (!subProject.shareHash) {
    throw new Error("Sub project not shared");
  }
  // check if share hash is valid
  if (subProject.shareHash !== hash) {
    throw new Error("Invalid share hash");
  }
  if (!subProject.isShared) {
    throw new Error("Sub project is not shared");
  }
  // @ts-ignore
  const prompts = subProject.prompts as PromptWithMetadata[];

  return {
    subProject,
    prompts,
  };
};

export const getSubProjectPromptsById = async (
  subProjectId: string | number
) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("Unauthenticated");
  }
  const isPlayground = subProjectId === "playground";
  if (isNaN(+subProjectId) && !isPlayground) {
    throw new Error("Invalid sub project id");
  }
  let findSubProjectId = subProjectId;
  if (isPlayground) {
    const playgroundProject = await db.query.subProjects.findFirst({
      where: (subProjects, { eq }) => eq(subProjects.userId, sessionUser.id),
    });
    if (!playgroundProject) {
      throw new Error("Playground not found");
    }
    findSubProjectId = playgroundProject.id;
  }

  try {
    const subProject = await queryDB.query.subProjects.findFirst({
      where: (subProject, { eq }) => eq(subProject.id, +findSubProjectId),
      with: {
        canvas: true,
        prompts: {
          with: {
            images: {
              with: {
                subProjectBookmark: true,
                feedImage: true,
              },
            },
            parentImage: {
              with: {
                subProjectBookmark: true,
                feedImage: true,
              },
            },
          },
        },
      },
    });
    if (!subProject) {
      throw new Error("Sub project not found");
    }

    // @ts-ignore
    const canvas = subProject?.canvas;

    if (!canvas) {
      throw new Error("Canvas not found");
    }

    if (subProject?.userId !== sessionUser.id) {
      throw new Error("Unauthorized");
    }
    // @ts-ignore
    const promptsArr = subProject?.prompts || [];

    const responsePayload = {
      ...subProject,
      prompts: promptsArr,
      count: promptsArr?.length,
      canvasId: canvas.id,
    };

    return responsePayload as unknown as ISubProjectByIdResponseModel;
  } catch (err) {
    console.log({ err });
    throw err;
  }
};
