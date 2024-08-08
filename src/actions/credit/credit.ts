"use server";
import { db } from "@/lib/db";
import { authOptions } from "@/utils/next-auth.options";
import { getServerSession } from "next-auth";

export const getUserCreditDetails = async () => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!sessionUser) {
    throw new Error("Unauthorized");
  }

  const credit = await db.query.credit.findFirst({
    where: (credit, { eq }) => eq(credit.userId, sessionUser.id),
  });

  if (!credit) {
    throw new Error("Not Found");
  }
  return credit;
};
