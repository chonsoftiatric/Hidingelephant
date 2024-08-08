import Button from "@/components/common/button/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PLANS } from "@/data/plans";
import { pricingItems } from "@/data/pricing";
import { cn } from "@/lib/utils";
import CheckoutButton from "@/modules/project/elements/CheckoutButton";
import { Check, HelpCircle, XIcon } from "lucide-react";
import React from "react";

type PricingCardProps = {
  plan_config: (typeof PLANS)[0] | undefined;
  amount: number | undefined;
  pricingItem: (typeof pricingItems)[0];
  index: number;
  isYear: boolean;
  compact?: boolean;
  isSubscribed: boolean;
  planName: string | undefined;
  planType: string | null;
  className?: string;

  handleFreePlan: () => void;
  handleSubscription: (payload: ICreateStripeSessionPayload) => void;
};
const PricingCard = ({
  amount,
  plan_config,
  isYear,
  compact,
  isSubscribed,
  planName,
  planType,
  className,
  pricingItem: { feature_title, features, plan, tagline, tags },

  handleFreePlan,
  handleSubscription,
}: PricingCardProps) => {
  const type = isYear ? "year" : "month";
  return (
    <div
      className={cn(
        "relative rounded-2xl bg-white shadow-lg dark:bg-zinc-900 border-[1px] border-light-gray md:w-[375px] w-full max-w-[450px] flex flex-col",
        {
          "border-2 border-blue-600 shadow-blue-200": plan === "Pro",
        },
        className
      )}
    >
      {plan === "Starter" && (
        <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
          Upgrade now
        </div>
      )}

      <div className="p-4">
        <h3 className="my-3 font-display text-3xl font-semibold">
          {plan} {plan === "Pro" ? `✨` : null}
        </h3>
        <p className="text-zinc-500 dark:text-zinc-300 max-w-[30ch]">
          {tagline}
        </p>
        <div className="flex flex-wrap gap-3 mt-3">
          {tags.map((tag) => (
            <div
              key={tag}
              className="rounded-full p-2 px-4 border-[1px] border-light-gray text-sm text-gray-700"
            >
              {tag}
            </div>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <p className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-primary-default leading-0">
            ${amount}
          </p>
          {plan_config?.name !== "Free" ? (
            <p className="text-zinc-500 dark:text-zinc-300 mb-2">
              / per {type}
            </p>
          ) : null}
        </div>
      </div>
      <div className="divider" />
      <div className="flex flex-col flex-1">
        {!compact ? (
          <div>
            <h5 className="text-lg font-semibold mt-8 px-6">{feature_title}</h5>
            <ul className="mt-3 mb-10 space-y-5 px-6">
              {features.map(({ text, footnote, negative }) => (
                <li key={text} className="flex space-x-5">
                  <div className="flex-shrink-0">
                    {negative ? (
                      <XIcon className="h-6 w-6 text-red-500" />
                    ) : (
                      <Check className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                  {footnote ? (
                    <div className="flex items-center space-x-1">
                      <p
                        className={cn("text-zinc-600 dark:text-zinc-300", {
                          "text-zinc-400": negative,
                        })}
                      >
                        {text}
                      </p>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger className="cursor-default ml-1.5">
                          <HelpCircle className="h-4 w-4 text-zinc-500" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80 p-2">
                          {footnote}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ) : (
                    <p
                      className={cn("text-zinc-600 dark:text-zinc-300", {
                        "text-zinc-400": negative,
                      })}
                    >
                      {text}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="flex flex-col my-6 mt-auto w-full">
          <div className="border-t border-gray-200" />
          {plan_config?.name === "Free" ? (
            <Button
              onClick={handleFreePlan}
              disabled={isSubscribed}
              className="w-[100%] md:w-[90%] mx-auto mt-6"
            >
              Continue Free
            </Button>
          ) : null}

          {plan_config && plan_config?.name !== "Free" ? (
            <CheckoutButton
              isSubscribed={isSubscribed}
              isSamePlan={planName === plan_config.name && planType === type}
              handleCheckout={() =>
                handleSubscription({
                  plan_duration: type,
                  plan_name: plan_config.name,
                })
              }
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
