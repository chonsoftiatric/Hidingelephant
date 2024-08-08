"use server";
import { cookies } from "next/headers";

export const setReferralCookie = async ({
  referralCode,
}: {
  referralCode: string;
}) => {
  if (referralCode) {
    cookies().set("referral_code", referralCode);
  }
  return new Response(null, { status: 200 });
};
