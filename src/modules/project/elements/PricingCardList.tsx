"use client";
import BlurEffect from "@/components/common/elements/BlurEffect";
import PricingCards from "@/modules/project/elements/PricingCards";
import SubscriptionPlanSwitch from "@/modules/project/elements/SubscriptionPlanSwitch";
import React from "react";

type PricingCardListProps = {
  isSubscribed: boolean;
  planName: string | undefined;
  planType: string | null;
  compact?: boolean;
  withoutFree?: boolean;
};

const PricingCardList = (props: PricingCardListProps) => {
  const [isYear, setIsYear] = React.useState(true);

  return (
    <>
      <div className="mx-auto mb-10 sm:maxw-lg">
        <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl dark:text-zinc-200 text-center">
          Manage Subscription
        </h1>
        <p className="mt-4 text-center text-zinc-600 dark:text-zinc-300 sm:text-lg">{`Want to get more out of Hiding Elephant? Subscribe to our professional plan.`}</p>
        <SubscriptionPlanSwitch isYear={isYear} setIsYear={setIsYear} />
      </div>
      <div className="mt-12 min-h-[70vh] flex flex-wrap justify-center gap-10  relative">
        <BlurEffect />
        <BlurEffect type="right" />

        {/* Pricing Cards */}
        <PricingCards {...props} isYear={isYear} />
      </div>
    </>
  );
};

export default PricingCardList;
