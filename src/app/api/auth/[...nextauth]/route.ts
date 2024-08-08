import NextAuth from "next-auth";
import { getCookie } from "cookies-next";
import { getAuthOptions } from "@/utils/next-auth.options";
import { NextApiResponse } from "next";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest, res: NextApiResponse) => {
  const referralCode = getCookie("referral_code", { cookies: cookies });
  // @ts-ignore
  return NextAuth(req, res, getAuthOptions(referralCode));
};
export const POST = async (req: NextRequest, res: NextApiResponse) => {
  const referralCode = getCookie("referral_code", { cookies: cookies });
  // @ts-ignore
  return NextAuth(req, res, getAuthOptions(referralCode));
};
