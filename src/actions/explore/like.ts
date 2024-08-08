"use server";
import { db } from "@/lib/db";
import { likes, users } from "@/lib/db/schema";
import { authOptions } from "@/utils/next-auth.options";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export const toggleFeedImageLike = async ({ id }: { id: string }) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    return new Response(null, { status: 401 });
  }
  // check if user already liked
  const dbLike = await db.query.likes.findFirst({
    where: (likes, { eq, and }) =>
      and(
        eq(likes.feedImageId, Number(id)),
        eq(likes.userId, Number(sessionUser.id))
      ),
  });
  const likeType = dbLike ? "UNLIKE" : "LIKE";
  if (likeType === "LIKE") {
    await db.insert(likes).values({
      userId: sessionUser.id,
      feedImageId: parseInt(id),
    });
  } else {
    await db
      .delete(likes)
      .where(
        and(
          eq(likes.userId, Number(sessionUser.id)),
          eq(likes.feedImageId, Number(id))
        )
      );
  }
  return {
    id,
  };
};
