import { updateEarnedCredit } from "@/controllers/credit.controller";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { IPlan } from "@/types/user.types";
import { PAID_PLAN_EARNED_CREDIT } from "@/utils/CONSTANTS";
import { price_id_plans } from "@/utils/stripe-plans";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.log({ err });
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
      { status: 400 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = Number(session?.metadata?.userId);
  if (!userId || isNaN(userId)) {
    // logger.error(`invalid userId in metadata ${userId}`);
    return new Response("invalid userId in metadata", {
      status: 400,
    });
  }
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });
  if (!user) {
    // @todo - add log
    return new Response("User not found", { status: 404 });
  }
  try {
    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const plan: IPlan | null =
        price_id_plans.find(
          (p) => p.priceId === subscription.items.data[0]?.price.id
        )?.plan || null;

      // if referred user - update referred user's credit information
      updateEarnedCredit(userId, PAID_PLAN_EARNED_CREDIT, true);
      await db
        .update(users)
        .set({
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0]?.price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
          plan: plan || user.plan,
        })
        .where(eq(users.id, userId));
    }

    if (event.type === "invoice.payment_succeeded") {
      // Retrieve the subscription details from Stripe.
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      await db
        .update(users)
        .set({
          stripePriceId: subscription.items.data[0]?.price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        })
        .where(eq(users.stripeSubscriptionId, subscription.id));
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      if (invoice.next_payment_attempt === null) {
        // Update user to free plan
        await db
          .update(users)
          .set({
            plan: "FREE",
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: new Date(),
          })
          .where(eq(users.id, userId));

        console.log(
          `Payment failed for user ${userId}. Reverted to FREE plan.`
        );

        // Cancel the subscription in Stripe
        await stripe.subscriptions.cancel(subscription.id);
      } else {
        // @todo - can update the user here about the failed payment attempt
        console.log(
          `Payment failed for user ${userId}, but there will be another attempt.`
        );
      }
    }

    if (event.type === "customer.subscription.updated") {
      // Retrieve the subscription details from Stripe.
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      // handle the plan cancellation
      if (
        subscription.status === "canceled" &&
        subscription.cancel_at_period_end
      ) {
        // Calculate the current period end date from the subscription
        const currentPeriodEndDate = new Date(
          subscription.current_period_end * 1000
        );

        // Update user's plan and subscription details in the database
        await db
          .update(users)
          .set({
            stripeCurrentPeriodEnd: currentPeriodEndDate,
            // WIP: update other subscription-related details
          })
          .where(eq(users.id, userId));

        console.log(
          `Subscription canceled for user ${userId}. Plan will end on ${currentPeriodEndDate}.`
        );

        // @todo - notify the user about the subscription cancellation
      } else if (
        subscription.status === "active" &&
        subscription.canceled_at !== null
      ) {
        // Subscription has been reactivated
        // Update the database with renewed subscription details
        const newPriceId = subscription.items.data[0]?.price.id;
        const newPlan =
          price_id_plans.find((p) => p.priceId === newPriceId)?.plan || "FREE";
        await db
          .update(users)
          .set({
            plan: newPlan,
            stripePriceId: newPriceId,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          })
          .where(eq(users.id, userId));

        console.log(`Subscription reactivated for user ${userId}.`);
        // @todo - notify the user about the subscription reactivation
      } else {
        const newPriceId = subscription.items.data[0]?.price.id;
        const newPlan =
          price_id_plans.find((p) => p.priceId === newPriceId)?.plan || "FREE";

        // Update user's plan in the database
        await db
          .update(users)
          .set({
            plan: newPlan,
            stripePriceId: newPriceId,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          })
          .where(eq(users.id, userId));

        console.log(`User ${userId} changed to plan: ${newPlan}`);
      }
    }

    return new Response(null, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "SERVER ERROR";
    // logger.error(`Something went wrong: ${message}`);
    return new Response(message, { status: 500 });
  }
}
