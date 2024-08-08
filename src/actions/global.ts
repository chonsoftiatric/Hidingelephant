"use server";

import { db } from "@/lib/db";
import { images, prompts, subProjects } from "@/lib/db/schema";
import { Image, IPrompt, ISubProject } from "@/types/db.schema.types";
import { ImageWithBookmarkAndFeed } from "@/types/db.types";
import { authOptions } from "@/utils/next-auth.options";
import { and, count, desc, eq, inArray, sum } from "drizzle-orm";
import { getServerSession } from "next-auth";

type LatestGeneratedImagesInput = {
  limit: number;
  offset: number;
};
/**
 * @description: fetch latest generated images by users in free plan
 * @param {*}
 * @return {*}
 */
export const fetchLatestGeneratedImages = async (
  data: LatestGeneratedImagesInput
) => {
  const newDBPrompts = await db.query.prompts.findMany({
    where: and(
      inArray(
        prompts.subProjectId,
        db
          .select({ id: subProjects.id })
          .from(subProjects)
          .where(eq(subProjects.visibility, "PUBLIC"))
      )
    ),
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
    limit: data.limit,
    orderBy: desc(prompts.createdAt),
  });

  const promptPayload = newDBPrompts as unknown as Array<
    IPrompt & {
      images: ImageWithBookmarkAndFeed[];
      parentImage: ImageWithBookmarkAndFeed | null;
    }
  >;
  return {
    prompts: promptPayload,
  };
};

export type LatestGeneratedImages = Awaited<
  ReturnType<typeof fetchLatestGeneratedImages>
>;

export const getUserDesignerStats = async () => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!sessionUser) {
    throw new Error("Unauthorized");
  }

  const imagesGeneratedByUser = await db
    .select({ count: count() })
    .from(images)
    .where(eq(images.userId, sessionUser.id));

  const totalImageGenerated = await db.select({ count: count() }).from(images);

  const likesOnUserContent = await db
    .select({ sum: sum(images.likes) })
    .from(images)
    .where(eq(images.userId, sessionUser.id));

  const responsePayload = {
    imagesGeneratedByUser,
    totalImageGenerated,
    likesOnUserContent,
  };
  return responsePayload;
};
