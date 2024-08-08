"use server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { BuyMoreCreditPaymentIntentInput } from "@/schemas/payment.schema";
import { BuyMoreCreditPaymentIntentResponse } from "@/types/payment.types";
import { authOptions } from "@/utils/next-auth.options";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function buyMoreCredit(body: BuyMoreCreditPaymentIntentInput) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!sessionUser) {
    throw new Error("Unauthorized");
  }

  const amount = body.amount === 50 ? 5 : 10;
  const stripeAmount = amount * 100;

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, sessionUser.id),
  });
  if (!user || !user.username) {
    throw new Error("Unauthorized");
  }

  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    // if not then create a new record in table
    const customer = await stripe.customers.create({
      name: user.username,
      email: user.email,
    });

    // and attach that id to user's profile
    await db
      .update(users)
      .set({ stripeCustomerId: customer.id })
      .where(eq(users.id, user.id));
    stripeCustomerId = customer.id;
  }

  // create a payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: stripeAmount,
    currency: "usd",
    customer: stripeCustomerId,
    automatic_payment_methods: {
      enabled: true,
    },
    description: `Buy extra credits: ${body.amount}`,
  });

  const resBody: BuyMoreCreditPaymentIntentResponse = {
    paymentIntentSecret: paymentIntent.client_secret,
    amount: body.amount,
  };

  return resBody;
}
