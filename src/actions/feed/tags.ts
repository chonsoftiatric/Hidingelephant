"use server";

import { db } from "@/lib/db";
import { feedImagesTags, tags } from "@/lib/db/schema";
import { CreateTagPayloadBody } from "@/modules/explore/schemas/tagSchema";
import { authOptions } from "@/utils/next-auth.options";
import { desc, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";

export const createTag = async ({ body }: { body: CreateTagPayloadBody }) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("Unauthorized");
  }

  const tag = await db.insert(tags).values({
    name: body.tag,
  });
  return tag[0].insertId;
};

export const getTopTagsData = async () => {
  const topTags = await db
    .select({
      tag: tags.name,
      count: sql<number>`count(${feedImagesTags.id})`,
    })
    .from(tags)
    .innerJoin(feedImagesTags, eq(tags.id, feedImagesTags.tagId))
    .groupBy(tags.name)
    .limit(30)
    .orderBy(desc(sql<number>`count(${feedImagesTags.id})`));

  return topTags;
};

export const getTagsBySearchQuery = async (q: string) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("Unauthorized");
  }
  if (!q) {
    throw new Error("Invalid query");
  }
  const searchResults = await db.query.tags.findMany({
    where: (tags, { like }) => like(tags.name, `%${q}%`),
  });
  return searchResults;
};
