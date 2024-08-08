import PricingPageView from "@/components/view/Pages/Pricing";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { notFound } from "next/navigation";
import React from "react";

const PricingPage = async () => {
  // @temp hidden
  if (2 > 1) {
    notFound();
  }
  const subscription = await getUserSubscriptionPlan();

  return (
    <PricingPageView
      isSubscribed={subscription.type !== null}
      planName={subscription.name}
      planType={subscription.type}
    />
  );
};

export default PricingPage;
