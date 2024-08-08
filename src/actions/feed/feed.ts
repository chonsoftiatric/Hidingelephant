"use server";
import { db } from "@/lib/db";
import {
  feedImages,
  feedImagesTags,
  images,
  likes,
  prompts,
  tags,
  users,
} from "@/lib/db/schema";
import { authOptions } from "@/utils/next-auth.options";
import { eq, sql, desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { IGetDesignerFeed } from "@/modules/explore/types/designer.types";
import { IFeedImagePostReq } from "@/modules/explore/schemas/feedImageSchemas";
import { MySqlSelect } from "drizzle-orm/mysql-core";
import { IGetFeedParams } from "@/modules/explore/types/feed.types";

function withTagFilter<T extends MySqlSelect>(qb: T, tag: string) {
  if (tag.toLowerCase() !== "all") {
    return qb.where(eq(tags.name, tag));
  }
  return qb;
}

function withSortByFilter<T extends MySqlSelect>(qb: T, sortby: string) {
  return qb.orderBy(
    sortby === "latest"
      ? desc(feedImages.createdAt)
      : desc(sql<number>`count(${likes.id})`)
  );
}

function withUsername<T extends MySqlSelect>(qb: T, username: string | null) {
  if (username) {
    return qb.where(eq(users.username, username));
  }
  return qb;
}

export const getFeedData = async ({
  offset,
  tag,
  sortBy = "latest",
  username,
}: IGetFeedParams) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (isNaN(offset)) {
    return;
  }

  try {
    let query = db
      .select({
        feedImageId: feedImages.id,
        title: feedImages.title,
        description: feedImages.description,
        postedAt: feedImages.createdAt,
        imageURL: images.imageUrl,
        name: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
        username: users.username,
        userImage: users.profileImage,
        likes: sql<number>`count(distinct(${likes.id}))`,
        isLiked: !sessionUser
          ? sql<number>`0`
          : sql<number>`count(case when ${likes.userId} = ${sessionUser?.id} then 1 else null end)`,
        tags: sql<string>`GROUP_CONCAT(${tags.name})`,
        prompt: prompts,
      })
      .from(feedImages)
      .leftJoin(likes, eq(likes.feedImageId, feedImages.id))
      .leftJoin(feedImagesTags, eq(feedImagesTags.feedImageId, feedImages.id))
      .leftJoin(tags, eq(feedImagesTags.tagId, tags.id))
      .innerJoin(users, eq(feedImages.userId, users.id))
      .innerJoin(images, eq(feedImages.imageId, images.id))
      .innerJoin(prompts, eq(images.promptId, prompts.id))
      .groupBy(
        feedImages.id,
        feedImages.title,
        feedImages.description,
        images.imageUrl,
        users.profileImage,
        sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`
      )
      .limit(12)
      .offset(offset)
      .$dynamic();

    if (sortBy) {
      query = withSortByFilter(query, sortBy);
    }
    if (tag) {
      query = withTagFilter(query, tag);
    }
    if (username) {
      query = withUsername(query, username);
    }
    const result = await query;

    const feed = result.map((item) => {
      return {
        ...item,
        tags: item.tags?.split(","),
        isLiked: item.isLiked > 0 ? 1 : 0,
      };
    });

    return { feed: feed, offset };
  } catch (err) {
    console.log(err);
    return;
  }
};
export type GetFeedDataResponse = Awaited<ReturnType<typeof getFeedData>>;
export type IFeedData = NonNullable<GetFeedDataResponse>["feed"];

export const getDesignerFeedData = async ({ id, offset }: IGetDesignerFeed) => {
  if (!id || !offset || isNaN(+id) || isNaN(+offset)) {
    throw new Error("Invalid offset or id");
  }

  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  const result = await db
    .select({
      feedImageId: feedImages.id,
      title: feedImages.title,
      description: feedImages.description,
      postedAt: feedImages.createdAt,
      imageURL: images.imageUrl,
      name: sql<string>`${users.firstName} ${users.lastName}`,
      userImage: users.profileImage,
      likes: sql<number>`count(${likes.id})`,
      isLiked: !sessionUser
        ? sql<number>`0`
        : sql<number>`count(case when ${likes.userId} = ${sessionUser?.id} then 1 else null end)`,
    })
    .from(feedImages)
    .leftJoin(likes, eq(likes.feedImageId, feedImages.id))
    .innerJoin(users, eq(feedImages.userId, users.id))
    .innerJoin(images, eq(feedImages.imageId, images.id))
    .groupBy(
      feedImages.id,
      feedImages.title,
      feedImages.description,
      images.imageUrl,
      sql<string>`${users.firstName} ${users.lastName}`,
      users.profileImage
    )
    .where(eq(users.username, id))
    .limit(12)
    .offset(offset)
    .orderBy(desc(feedImages.updatedAt));

  return { feed: result, offset };
};

export const getFeedImageData = async ({ id }: { id: string }) => {
  if (!id) {
    throw new Error("Invalid id");
  }

  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  const result = await db
    .select({
      feedImageId: feedImages.id,
      title: feedImages.title,
      description: feedImages.description,
      postedAt: feedImages.createdAt,
      imageURL: images.imageUrl,
      username: users.username,
      userImage: users.profileImage,
      prompt: prompts,
      likes: sql<number>`count(${likes.id})`,
      isLiked: !sessionUser
        ? sql<number>`0`
        : sql<number>`count(case when ${likes.userId} = ${sessionUser?.id} then 1 else null end)`,
    })
    .from(feedImages)
    .leftJoin(likes, eq(likes.feedImageId, feedImages.id))
    .innerJoin(images, eq(feedImages.imageId, images.id))
    .innerJoin(users, eq(feedImages.userId, users.id))
    .innerJoin(prompts, eq(images.promptId, prompts.id))
    .where(eq(feedImages.id, Number(id)))
    .groupBy(
      feedImages.id,
      feedImages.title,
      feedImages.description,
      images.imageUrl,
      users.profileImage
    );

  return result[0];
};

export const shareImageToFeed = async ({
  body,
}: {
  body: IFeedImagePostReq;
}) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("Unauthorized");
  }

  // get the image
  const image = await db.query.images.findFirst({
    where: (images, { eq }) => eq(images.id, body.imageId),
  });

  if (!image) {
    throw new Error("Image not found");
  }
  const feedImageBody = {
    imageId: body.imageId,
    userId: sessionUser.id,
    title: body.title,
    description: body.description || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const feedImage = await db.insert(feedImages).values(feedImageBody);
  if (body.tags) {
    const feedImageTagsEntry = await Promise.all(
      body.tags.map((tagId) => {
        return {
          feedImageId: feedImage[0].insertId,
          tagId: tagId,
        };
      })
    );
    await db.insert(feedImagesTags).values(feedImageTagsEntry);
  }
  await db
    .update(images)
    .set({ isPrivate: false })
    .where(eq(images.id, body.imageId));

  return {
    id: feedImage[0].insertId,
    promptId: image.promptId,
    ...feedImageBody,
  };
};
