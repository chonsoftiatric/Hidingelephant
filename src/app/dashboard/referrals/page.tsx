"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserDetails, useUserReferralInfo } from "@/services/user.service";
import { notFound } from "next/navigation";
import toast from "react-hot-toast";

const ReferralPage = () => {
  // @temp hidden
  if (2 > 1) {
    notFound();
  }
  const { data: user } = useUserDetails();
  const { data: referralData } = useUserReferralInfo();
  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}/?referral_code=${user?.referralCode}`;
  5;
  const onClickCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Link Copied to Clipboard");
  };

  type ReferralFormattedData = {
    free: number;
    paid: number;
    total: number;
  };
  const getFormattedData = (): ReferralFormattedData => {
    const data: ReferralFormattedData = {
      free: 0,
      paid: 0,
      total: 0,
    };
    if (!referralData?.referredUsers?.length) return data;
    for (const user of referralData.referredUsers) {
      if (user.plan === "FREE") {
        data.free++;
      } else {
        data.paid++;
      }
      data.total++;
    }
    return data;
  };
  const formattedData = getFormattedData();

  return (
    <div className="pb-10 overflow-auto">
      <div className=" p-3 px-5 font-semibold text-xl">Referral</div>

      <div className="p-6 flex flex-col gap-6 md:pl-[50px]">
        <div className="flex gap-5 items-center">
          <h1 className="text-xl font-medium">Refferral Link</h1>{" "}
          <div
            className="p-2 bg-light-gray rounded-md cursor-pointer"
            onClick={onClickCopy}
          >
            {referralLink}
          </div>
        </div>

        <Card className="max-w-[300px]">
          <CardHeader>
            <h1 className="text-xl">
              <span className="font-medium">Users Refferred : </span>
              {formattedData.total}
            </h1>
          </CardHeader>
          <CardContent>
            <h2>Free Users : {formattedData.free}</h2>
            <h2>Paid Users : {formattedData.paid}</h2>
          </CardContent>
        </Card>

        <Card className="max-w-[300px]">
          <CardHeader>
            <h1>
              <span className="font-medium">Credits Gained : </span>
              {referralData?.creditInfo?.earnedCredits || 0}
            </h1>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default ReferralPage;
