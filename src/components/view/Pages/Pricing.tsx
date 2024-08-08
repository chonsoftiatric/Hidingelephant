"use client";
import React from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import PricingCards from "@/modules/project/elements/PricingCards";
import PricingCardList from "@/modules/project/elements/PricingCardList";

type IPricingPageView = {
  isSubscribed: boolean;
  planName: string | undefined;
  planType: string | null;
};
const PricingPageView = ({
  isSubscribed,
  planName,
  planType,
}: IPricingPageView) => {
  return (
    <PublicLayout>
      <div className="container mt-8 mb-20">
        <PricingCardList
          isSubscribed={isSubscribed}
          planName={planName}
          planType={planType}
        />
      </div>
    </PublicLayout>
  );
};

export default PricingPageView;
