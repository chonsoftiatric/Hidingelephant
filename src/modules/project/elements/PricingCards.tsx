"use client";

import { pricingItems } from "@/data/pricing";
import { PLANS } from "@/data/plans";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, HelpCircle, XIcon } from "lucide-react";
import CheckoutButton from "@/modules/project/elements/CheckoutButton";
import { useSession } from "next-auth/react";
import { useStripePlanSettings } from "@/services/features.service";
import Button from "@/components/common/button/Button";
import { deleteCookie, getCookie } from "cookies-next";
import { DEFAULT_SUB_PROJECT_ID_COOKIE } from "@/utils/CONSTANTS";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createStripeSession } from "@/services/stripe.service";
import { cn } from "@/lib/utils";
import BlurEffect from "@/components/common/elements/BlurEffect";
import React from "react";
import { Switch } from "@/components/ui/switch";
import PricingCard from "@/modules/project/elements/pricing/PricingCard";

type IPricingPageView = {
  isSubscribed: boolean;
  planName: string | undefined;
  planType: string | null;
  compact?: boolean;
  isYear: boolean;
  cardClassName?: string;
  withoutFree?: boolean;
};

const PricingCards = ({
  isSubscribed,
  planName,
  planType,
  isYear,
  cardClassName,
  compact = false,
  withoutFree = false,
}: IPricingPageView) => {
  const router = useRouter();
  const { data } = useStripePlanSettings();
  const session = useSession();
  const user = session.data?.user;
  const defaultSubProjectId = getCookie(DEFAULT_SUB_PROJECT_ID_COOKIE);
  const type = isYear ? "year" : "month";

  const handleFreePlan = () => {
    if (user) {
      if (defaultSubProjectId) {
        router.replace(`/p/${defaultSubProjectId}`); // navigate to default-sub-project page
        setTimeout(() => {
          deleteCookie(DEFAULT_SUB_PROJECT_ID_COOKIE);
        }, 3000);
      } else {
        router.replace("/p/playground"); // navigate to projects page
      }
    } else {
      router.push(`/login?plan=Free&plan_duration=${type}`);
    }
  };

  const { mutate } = useMutation({
    mutationFn: createStripeSession,
    onSuccess: (data) => {
      window.location.href = data.url ?? "/dashboard/billing";
    },
  });

  const handleSubscription = (payload: ICreateStripeSessionPayload) => {
    if (session.status === "unauthenticated") {
      router.push(
        `/login?plan=${payload.plan_name}&plan_duration=${payload.plan_duration}`
      );
    } else {
      mutate(payload);
    }
  };

  return (
    <>
      {pricingItems.map((item, index) => {
        // check if plan is enabled
        const isEnabled = data?.plan_enabled[index];
        if (!isEnabled) return <></>;
        if (withoutFree && item.plan === "Free") return <></>;
        const plan_config = PLANS.find((p) => p.name === item.plan);
        const amount =
          type === "year"
            ? plan_config?.price?.year?.amount
            : plan_config?.price?.month.amount;
        return (
          <PricingCard
            key={`${item.plan}-${index}`}
            amount={amount}
            handleFreePlan={handleFreePlan}
            handleSubscription={handleSubscription}
            index={index}
            isSubscribed={isSubscribed}
            isYear={isYear}
            planName={planName}
            planType={planType}
            plan_config={plan_config}
            pricingItem={item}
            compact={compact}
            className={cardClassName}
          />
        );
      })}
    </>
  );
};

export default PricingCards;
