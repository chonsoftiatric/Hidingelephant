"use server";
import { db } from "@/lib/db";
import { credit } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { authOptions } from "@/utils/next-auth.options";
import { getServerSession } from "next-auth";

export async function addMoreCredit({
  paymentIntentId,
}: {
  paymentIntentId: string;
}) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("Unauthenticated");
  }
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, sessionUser.id),
  });
  if (!user) {
    throw new Error("User not found");
  }
  const creditItem = await db.query.credit.findFirst({
    where: (credit, { eq }) => eq(credit.userId, user.id),
  });
  if (!creditItem) {
    throw new Error("Credit not found!");
  }

  if (!paymentIntentId) {
    throw new Error("Payment intent ID is required");
  }
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const amount = intent.amount / 100;
  const purchasedCredit = amount * 10;
  const updatedRemainingCredit = creditItem.remainingCredits + purchasedCredit;
  const updatedPurchasedCredit = creditItem.purchasedCredits + purchasedCredit;
  const updatedMonthlyCredit = creditItem.monthlyCredit + purchasedCredit;
  await db.update(credit).set({
    remainingCredits: updatedRemainingCredit,
    purchasedCredits: updatedPurchasedCredit,
    monthlyCredit: updatedMonthlyCredit,
  });
  return `Credit purchased successfully!`;
}
