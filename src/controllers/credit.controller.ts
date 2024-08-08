import { db } from "@/lib/db";
import { credit, creditHistory, creditsUsed } from "@/lib/db/schema";
import { fetchKvStore } from "@/lib/vercel-kv";
import { ICredit, IDBUser } from "@/types/db.schema.types";
import { IStripePlanSettingsConfig } from "@/types/feature.types";
import { IPlan } from "@/types/user.types";
import { MAX_EARNED_CREDIT } from "@/utils/CONSTANTS";
import { plan_to_index } from "@/utils/stripe-plans";
import { eq } from "drizzle-orm";

/**
 * subtract the calculated credits from user's credit based on execution time
 * @param execution execution time in seconds
 * @param userId user's id
 */
type CreditsUsedPayload = {
  elephantBrain: string | undefined;
  elephantStyle?: string;
  numberOfImages: number;
  generationType: "DEFAULT" | "MAGIC" | "SKETCH" | "SIMILAR";
};
export const updatedCreditBalance = async (
  execution: number,
  userId: number,
  creditsUsedPayload: CreditsUsedPayload
) => {
  const creditInfo = await db.query.credit.findFirst({
    where: (credit, { eq }) => eq(credit.userId, userId),
    with: {
      user: true,
    },
  });
  if (!creditInfo) {
    console.log(`Could not find credit info for user ${userId}`);
    throw new Error(`Could not find credit info for user ${userId}`);
  }
  // @ts-ignore
  const dbUser = creditInfo?.user as IDBUser;

  // fetch credit execution relation from redis
  const creditData = await fetchKvStore("credit-value");
  if (creditData?.key !== "credit-value") {
    console.log(`Credit value is not set in redis`);
    throw new Error(`Credit value is not set in redis`);
  }
  const creditValue = creditData.value; // 1 credit value in seconds
  const totalCreditsUsed = +(execution / creditValue).toFixed(2);
  const remainingCredits =
    (creditInfo.remainingCredits || 0) - totalCreditsUsed;
  // update credits
  await db
    .update(credit)
    .set({ remainingCredits: remainingCredits })
    .where(eq(credit.userId, userId));

  // save credits used
  await db.insert(creditsUsed).values({
    userId: creditInfo.userId,
    creditsUsed: totalCreditsUsed,
    creditValue: creditValue,
    timeTaken: execution * 1000,
    createdAt: new Date(),
    ...creditsUsedPayload,
    plan: dbUser?.plan,
  });
};
export const updatedCreditBalanceDirect = async (
  credits: number,
  userId: number,
  creditsUsedPayload: CreditsUsedPayload,
  timeTaken: number = 0
) => {
  const creditInfo = await db.query.credit.findFirst({
    where: (credit, { eq }) => eq(credit.userId, userId),
    with: {
      user: true,
    },
  });
  if (!creditInfo) {
    throw new Error(`Could not find credit info for user ${userId}`);
  }
  // @ts-ignore
  const dbUser = creditInfo.user as IDBUser;
  const creditData = await fetchKvStore("credit-value");
  if (creditData?.key !== "credit-value") {
    console.log(`Credit value is not set in redis`);
    throw new Error(`Credit value is not set in redis`);
  }
  const creditValue = creditData.value; // 1 credit value in seconds

  const remainingCredits = (creditInfo.remainingCredits || 0) - credits;
  // update credits
  await db
    .update(credit)
    .set({ remainingCredits: remainingCredits })
    .where(eq(credit.userId, userId));

  await db.insert(creditsUsed).values({
    userId: creditInfo.userId,
    creditsUsed: credits,
    creditValue: creditValue,
    timeTaken: timeTaken,
    createdAt: new Date(),
    ...creditsUsedPayload,
    plan: dbUser?.plan,
  });
};

/**
 * create credit history and reset credit information every month (cronjob)
 * @param credit credit information
 */
type IResetCreditInfo = {
  credit: ICredit & { user: { plan: IPlan } | null };
  stripe_config_data: IStripePlanSettingsConfig;
};

export const resetCreditInfo = async ({
  credit: creditData,
  stripe_config_data,
}: IResetCreditInfo) => {
  try {
    if (creditData?.user?.plan) {
      // create a history entry in creditHistory table
      const totalCredits =
        (creditData.credits || 0) + (creditData.earnedCredits || 0);
      await db.insert(creditHistory).values({
        creditId: creditData.id,
        credits: totalCredits,
        creditsUsed: totalCredits - (creditData.remainingCredits || 0),
        plan: creditData.user.plan,
      });
      const credits =
        stripe_config_data.credits[plan_to_index[creditData.user.plan]] || 0;

      const defaultCredit = creditData.credits + creditData.earnedCredits;
      const remainingCredits = creditData.remainingCredits;
      const monthlyCredits =
        remainingCredits >= defaultCredit ? remainingCredits : defaultCredit;

      // reset credit information
      await db
        .update(credit)
        .set({
          credits: credits,
          remainingCredits: monthlyCredits,
          monthlyCredit: monthlyCredits,
        })
        .where(eq(credit.id, creditData.id));
    }
  } catch (err) {
    // @todo - log error
  }
};

/**
 * update earned credit for paid plan
 * @param userId referred to user's id
 * @param addEarnedCredits number of credits to add/increment in earnedCredits
 */
type IReferredToUser =
  | (IDBUser & {
      invitedBy: (IDBUser | undefined) & { credit: ICredit | undefined };
      credit: ICredit | undefined;
    })
  | undefined;

export const updateEarnedCredit = async (
  userId: number,
  addEarnedCredits: number,
  isPaidPlan: boolean = false
) => {
  const referredToUser = (await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
    with: {
      invitedBy: {
        with: {
          credit: true,
        },
      },
      credit: true,
    },
  })) as IReferredToUser;
  const userCreditInfo = referredToUser?.credit;
  const refferedUserCreditInfo = referredToUser?.invitedBy?.credit;

  if (!refferedUserCreditInfo) return; // no referred user
  if (userCreditInfo?.creditsAllocated && isPaidPlan) return; // credit is already allocated for paid plan upgrade;

  // is current earnedCredits is less than MAX_EARNED_CREDIT? (true | false)
  const canIncrement: boolean =
    (refferedUserCreditInfo.earnedCredits || 0) < MAX_EARNED_CREDIT;

  const earnedCreditAfterIncrement =
    (refferedUserCreditInfo.earnedCredits || 0) + addEarnedCredits;
  const incrementedEarnedCredits: number =
    earnedCreditAfterIncrement >= MAX_EARNED_CREDIT
      ? MAX_EARNED_CREDIT
      : earnedCreditAfterIncrement;
  const incrementedCredits =
    incrementedEarnedCredits - (refferedUserCreditInfo.earnedCredits || 0);

  const incrementedRemainingCredits = canIncrement
    ? (refferedUserCreditInfo.remainingCredits || 0) + incrementedCredits
    : refferedUserCreditInfo.remainingCredits;

  // updated referred user's credit information
  await db
    .update(credit)
    .set({
      earnedCredits: incrementedEarnedCredits,
      remainingCredits: incrementedRemainingCredits,
    })
    .where(eq(credit.id, refferedUserCreditInfo.id));
  // updated referred to user's creditsAllocated to true
  if (userCreditInfo) {
    await db
      .update(credit)
      .set({
        creditsAllocated: isPaidPlan ? true : false,
      })
      .where(eq(credit.id, userCreditInfo.id));
  }
};
