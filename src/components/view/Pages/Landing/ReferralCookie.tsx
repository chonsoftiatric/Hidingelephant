"use client";

import { setReferralCookie } from "@/actions/referral/referral";
import axios from "axios";
import React from "react";

type IReferralCookie = {
  referralCode?: string;
};

const ReferralCookie = ({ referralCode }: IReferralCookie) => {
  const handleSetReferralCookie = async (referralCode: string) => {
    await setReferralCookie({ referralCode });
  };
  React.useEffect(() => {
    if (referralCode) {
      handleSetReferralCookie(referralCode);
    }
  }, [referralCode]);
  return <></>;
};

export default ReferralCookie;
