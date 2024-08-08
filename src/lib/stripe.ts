import { PLANS } from "@/data/plans";
import { queryDB } from "./db";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/next-auth.options";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
  typescript: true,
});

export async function getUserSubscriptionPlan() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.id) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
      type: null,
    };
  }

  const dbUser = await queryDB.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user.id),
  });

  if (!dbUser) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
      type: null,
    };
  }

  // default plan (free) - @todo - use the free/beta-tester plan based on user role
  if (!dbUser.stripeCustomerId) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
      type: null,
    };
  }

  const isSubscribed = Boolean(
    dbUser.stripePriceId &&
      dbUser.stripeCurrentPeriodEnd && // 86400000 = 1 day
      dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  );

  const plan = isSubscribed
    ? PLANS.find(
        (plan) =>
          plan.price.month.priceIds.test === dbUser.stripePriceId ||
          plan.price.year.priceIds.test === dbUser.stripePriceId
      )
    : null;
  const type = plan
    ? plan.price.month.priceIds.test === dbUser.stripePriceId
      ? "month"
      : "year"
    : null;

  let isCanceled = false;
  if (isSubscribed && dbUser.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      dbUser.stripeSubscriptionId
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    ...plan,
    stripeSubscriptionId: dbUser.stripeSubscriptionId,
    stripeCurrentPeriodEnd: dbUser.stripeCurrentPeriodEnd,
    stripeCustomerId: dbUser.stripeCustomerId,
    isSubscribed,
    isCanceled,
    type,
  };
}
