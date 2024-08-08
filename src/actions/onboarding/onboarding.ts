"use server";
import { db } from "@/lib/db";
import { onBoarding, users } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/next-auth.options";
import { eq } from "drizzle-orm";
import { IOnBoarding } from "@/types/global.types";

export const onboardUser = async ({ data }: { data: Partial<IOnBoarding> }) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!sessionUser) {
    throw new Error("unauthorized");
  }

  if (data.profileImage && data.username) {
    await db
      .update(users)
      .set({ username: data.username, profileImage: data.profileImage })
      .where(eq(users.id, sessionUser.id));
  }

  if (
    data.workRole &&
    data.primaryUsage &&
    data.sourceReference &&
    data.teamSize
  ) {
    const oldRecord = await db.query.onBoarding.findFirst({
      where: eq(onBoarding.userId, sessionUser.id),
    });

    if (!oldRecord) {
      await db.insert(onBoarding).values({
        sourceReference: data.sourceReference,
        teamSize: data.teamSize,
        userId: sessionUser.id,
        primaryUsage: data.primaryUsage,
        workRole: data.workRole,
      });
    } else {
      await db
        .update(onBoarding)
        .set({
          sourceReference: data.sourceReference,
          teamSize: data.teamSize,
          userId: sessionUser.id,
          primaryUsage: data.primaryUsage,
          workRole: data.workRole,
        })
        .where(eq(onBoarding.id, oldRecord.id));
    }
  }

  return "OK";
};

export const getUserOnBoardingDetails = async () => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("unauthorized");
  }

  const onBoardingDetails = await db.query.onBoarding.findFirst({
    where: (onBoarding, { eq }) => eq(onBoarding.userId, sessionUser.id),
  });

  if (!onBoardingDetails) {
    throw new Error("no details found");
  }
  return { data: onBoardingDetails };
};
