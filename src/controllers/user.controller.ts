import { db } from "@/lib/db";
import { credit, users } from "@/lib/db/schema";

import {
  DEFAULT_SUB_PROJECT_ID_COOKIE,
  FREE_PLAN_EARNED_CREDIT,
  IS_NEW_USER_COOKIE,
} from "@/utils/CONSTANTS";
import { generateUniqueString } from "@/utils/fn.backend";
import { setCookie } from "cookies-next";
import { cookies } from "next/headers";
import { updateEarnedCredit } from "./credit.controller";
import { fetchKvStore } from "@/lib/vercel-kv";
import { User } from "next-auth";
import { createProject } from "./project.controller";
import { IDBUser } from "@/types/db.schema.types";

type ICreateUser = {
  user: User;
  referralCode: string | undefined;
};
export const createUser = async ({
  user,
  referralCode,
}: ICreateUser): Promise<IDBUser> => {
  if (!user.email) {
    throw new Error("Invalid user email");
  }
  // fetch stripe plan config - restrict login if not available
  const stripe_config_data = await fetchKvStore("stripe-plans-settings");
  if (stripe_config_data?.key !== "stripe-plans-settings") {
    throw new Error("Stripe plan settings not available");
  }
  const referredUser = referralCode
    ? await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.referralCode, referralCode),
      })
    : null;

  const newReferralCode = generateUniqueString(user.email);

  const createdUser = await db.insert(users).values({
    //@ts-ignore
    email: user.email,
    firstName: user?.firstName || "",
    lastName: user.lastName || "",
    emailVerified: null,
    profileImage: user.image,
    referralCode: newReferralCode,
    invitedById: referredUser ? referredUser.id : undefined,
  });

  const dbUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, createdUser[0].insertId),
  });
  if (!dbUser) {
    throw new Error("User not found");
  }

  // user the stripe config and user id to create a credit row
  const credits = stripe_config_data.value.credits[0]; // credit on index 0 for free plan
  await db.insert(credit).values({
    userId: createdUser[0].insertId,
    credits: credits,
    remainingCredits: credits,
    earnedCredits: 0,
  });

  // if referredUser - updated referred user's earnedCredits
  if (referredUser) {
    updateEarnedCredit(dbUser.id, FREE_PLAN_EARNED_CREDIT);
  }

  // create default project
  const subProjectId = await createProject({
    payload: {
      name: "Playground",
      type: "PLAYGROUND",
    },
    userId: dbUser.id,
    isBetaTester: dbUser.role === "BETA_TESTER",
  });

  setCookie(IS_NEW_USER_COOKIE, "NEW_USER", { cookies: cookies });
  setCookie(DEFAULT_SUB_PROJECT_ID_COOKIE, subProjectId, { cookies: cookies });
  return dbUser;
};
