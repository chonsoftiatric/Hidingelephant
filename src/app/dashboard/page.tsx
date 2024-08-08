"use client";
import RecentProjectCard from "@/modules/project/elements/RecentProjectCard";
import UsageStats from "@/modules/project/elements/UsageStats";
import LabelInfo from "@/components/common/LabelInfo";
import Button from "@/components/common/button/Button";
import CrownIcon from "@/components/icons/CrownIcon";
import { Slider } from "@/components/ui/slider";
import {
  useCreditDetails,
  useGetLastPrompts,
  useUserDetails,
} from "@/services/user.service";
import { useGlobalStore } from "@/store/global";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeIcon } from "lucide-react";

const Dashboard = () => {
  const { setActiveModal } = useGlobalStore();
  const [creditDetails, setCreditDetails] = useState<{
    used: number;
    total: number;
  }>({ total: 0, used: 0 });

  const { data: userCredit } = useCreditDetails();
  const { data: user } = useUserDetails();
  const { data: recentPrompts, isLoading } = useGetLastPrompts();

  useEffect(() => {
    if (userCredit) {
      const total = userCredit.monthlyCredit;
      const used = Number((total - userCredit.remainingCredits).toFixed(2));
      setCreditDetails({
        used,
        total,
      });
    }
  }, [userCredit]);

  const handleUpgradePlan = () => {
    setActiveModal("upgrade-subscription");
  };
  const handleBuyMoreCredit = () => {
    setActiveModal("buy-more-credit");
  };

  return (
    <div className="pb-10 overflow-auto">
      <div className="p-3 px-5 font-semibold text-xl">Dashboard</div>
      <div className="p-3 md:pl-[50px]">
        <div className="text-xl font-medium">Recent Projects</div>
        <div className="mt-4 flex flex-wrap gap-5 max-md:justify-center">
          {isLoading && <Skeleton className="w-[380px] h-[200px] rounded-xl" />}

          {recentPrompts?.map((item, index) => (
            <RecentProjectCard {...item} key={`${index}-recent-prompts`} />
          ))}
        </div>
      </div>
      <div className="p-3 md:pl-[50px]">
        <div className="mt-8  text-xl font-medium">Plan & Usage</div>
        <div className="flex flex-col gap-2 mt-4 max-w-[700px]">
          <LabelInfo
            label="Remaining Credits"
            infoText="Your available credits for image generation"
            className="ml-4 mt-4 font-medium"
          />
          <div className="flex items-center gap-6 max-w-[450px]">
            <Slider
              className="flex-1 ml-4 credit-slider"
              value={[creditDetails.used]}
              max={creditDetails.total}
            />
            <p>
              {Math.ceil(
                creditDetails.total - creditDetails.used
              ).toLocaleString()}{" "}
              / {Math.ceil(creditDetails.total).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <Button
              leftIcon={<BadgeIcon size={18} className="stroke-white" />}
              className="self-start rounded-xl mt-4"
              onClick={handleBuyMoreCredit}
            >
              Buy Credit
            </Button>
            {/* @temp hidden */}
            {user?.plan != "PRO" && false ? (
              <Button
                leftIcon={<CrownIcon className="stroke-white" />}
                className="self-start rounded-xl mt-4"
                onClick={handleUpgradePlan}
              >
                Upgrade to unlock more
              </Button>
            ) : null}
          </div>
        </div>
        <div className="p-3 mt-8">
          <div className="text-lg font-medium">Stats</div>
          <UsageStats className="mt-4" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
