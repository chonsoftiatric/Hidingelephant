"use server";

import { db } from "@/lib/db";
import { comments, users } from "@/lib/db/schema";
import { commentPostSchema } from "@/modules/explore/schemas/commentSchema";
import {
  ICommentPost,
  IGetCommentsOnFeedReq,
} from "@/modules/explore/types/comment.types";
import { authOptions } from "@/utils/next-auth.options";
import { desc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export const getFeedImageCommentsById = async ({
  id,
  offset = 0,
}: IGetCommentsOnFeedReq) => {
  if (!id) {
    throw new Error("Invalid id");
  }

  const result = await db
    .select({
      commentId: comments.id,
      comment: comments.comment,
      postedAt: comments.createdAt,
      username: users.username,
      avatar: users.profileImage,
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.feedImageId, Number(id)))
    .orderBy(desc(comments.createdAt))
    .limit(12)
    .offset(offset);
  return { comments: result, offset };
};

export const addComment = async ({
  id,
  payload,
}: {
  id: string;
  payload: ICommentPost;
}) => {
  if (!id) {
    throw new Error("Invalid id");
  }
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("Unauthorized");
  }

  const body = commentPostSchema.parse(payload);
  const comment = await db.insert(comments).values({
    comment: body.comment,
    feedImageId: parseInt(id),
    userId: sessionUser.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return comment[0].insertId;
};
