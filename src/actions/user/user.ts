"use server";
import { db } from "@/lib/db";
import { images, likes, users } from "@/lib/db/schema";
import { IUpdateDesignerProfile } from "@/modules/explore/schemas/designer.schema";
import { IUpdateUserDetails } from "@/services/user.service";
import { IDBUser } from "@/types/db.schema.types";
import { authOptions } from "@/utils/next-auth.options";
import { count, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

// Get user's first project (Playground)
export const getUserFirstProject = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return;
  try {
    const subProject = await db.query.subProjects.findFirst({
      where: (subProjects, { eq }) => eq(subProjects.userId, session.user.id),
    });
    return subProject;
  } catch (err) {
    console.log({ err });
    return;
  }
};

type UpdateUserProfileInput = {
  body: IUpdateDesignerProfile;
};
export const updateUserDeginerProfile = async ({
  body,
}: UpdateUserProfileInput) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    return new Response(null, { status: 401 });
  }
  const result = await db
    .update(users)
    .set({
      firstName: body.firstName,
      lastName: body.lastName,
      profileImage: body.userAvatar,
      coverImage: body.userCover,
      linkedinUrl: body.linkedinUrl,
      facebookUrl: body.facebookUrl,
      twitterUrl: body.twitterUrl,
    })
    .where(eq(users.id, sessionUser.id));
  return result;
};

/**
 * Get designer data by username
 */
export const getDesignerDataByUsername = async (username: string) => {
  const dbUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  // user likes
  const likesCount = await db
    .select({ likes: count(likes.userId) })
    .from(likes)
    .where(eq(likes.userId, dbUser.id));

  //total images generated
  const imagesGenerated = await db
    .select({ images: count(images.userId) })
    .from(images)
    .where(eq(images.userId, dbUser.id));
  const totalLikes = likesCount[0].likes;

  const responsePayload = {
    id: dbUser.id,
    firstName: dbUser.firstName,
    lastName: dbUser.lastName,
    avatar: dbUser.profileImage,
    cover: dbUser.coverImage,
    imagesGenerated: imagesGenerated[0].images,
    totalLikes: totalLikes,
    linkedinUrl: dbUser.linkedinUrl,
    facebookUrl: dbUser.facebookUrl,
    twitterUrl: dbUser.twitterUrl,
  };
  return responsePayload;
};

export const getUserDetailsById = async (id: number) => {
  const userId = +id;
  if (isNaN(userId)) {
    throw new Error("Invalid user id");
  }
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const updateUserProfileDetails = async (data: IUpdateUserDetails) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!sessionUser) {
    throw new Error("Unauthenticated");
  }

  if (!data) {
    return new Response(null, { status: 400 });
  }

  await db
    .update(users)
    .set({
      firstName: data.firstName,
      lastName: data.lastName,
      profileImage: data.profileImage,
    })
    .where(eq(users.id, sessionUser.id));

  return "user details updated";
};

export const getCurrentUserReferralInfo = async () => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("Unauthenticated");
  }
  const userId = sessionUser.id;
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });
  if (!user) {
    throw new Error("User not found");
  }
  const referredUsers = await db.query.users.findMany({
    where: (users, { eq }) => eq(users.invitedById, userId),
  });
  const creditInfo = await db.query.credit.findFirst({
    where: (credit, { eq }) => eq(credit.userId, userId),
  });
  if (!creditInfo) {
    throw new Error("Credit not found");
  }
  const responsePayload = {
    referredUsers,
    creditInfo,
  };
  return responsePayload;
};
