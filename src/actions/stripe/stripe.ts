"use server";

import { PLANS } from "@/data/plans";
import { db, queryDB } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/utils";
import { authOptions } from "@/utils/next-auth.options";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

type CreateStripeSession = {
  plan_name: string;
  plan_duration: "month" | "year";
};
export const createStripeSubscriptionSession = async (
  body: CreateStripeSession
) => {
  const plan_name = body.plan_name;
  const plan_duration = body.plan_duration as "month" | "year";
  if (plan_duration !== "month" && plan_duration !== "year") {
    throw new Error(`Invalid plan duration`);
  }
  const billingUrl = absoluteUrl("/dashboard/billing");
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const dbUser = await queryDB.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });
  if (!dbUser || !dbUser.username) {
    throw new Error("Unauthorized");
  }
  let stripeCustomerId = dbUser.stripeCustomerId;
  if (!stripeCustomerId) {
    // if not then create a new record in table
    const customer = await stripe.customers.create({
      name: dbUser.username,
      email: dbUser.email,
    });
    // and attach that id to user's profile
    await db
      .update(users)
      .set({ stripeCustomerId: customer.id })
      .where(eq(users.id, dbUser.id));
    stripeCustomerId = customer.id;
  }
  if (!stripeCustomerId) {
    throw new Error("Failed to create stripe customer id");
  }

  const subscriptionPlan = await getUserSubscriptionPlan();
  if (subscriptionPlan.isSubscribed && stripeCustomerId) {
    // @todo - send user to subscription management page
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: billingUrl,
    });
    return {
      url: stripeSession.url,
    };
  }
  const plan = PLANS.find((plan) => plan.name === plan_name);
  if (!plan) {
    throw new Error("Invalid plan");
  }
  try {
    // user is not subscribed yet
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer: stripeCustomerId,
      line_items: [
        {
          price: plan.price[plan_duration].priceIds.test,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });
    return {
      url: stripeSession.url,
    };
  } catch (err) {
    console.log({ err });
    throw new Error((err as unknown as Error).message);
  }
};

export const getUserStripeSubscriptionPlan = async () => {
  const subscription = await getUserSubscriptionPlan();
  return subscription;
};
