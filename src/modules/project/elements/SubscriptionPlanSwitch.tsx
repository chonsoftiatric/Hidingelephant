import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import React from "react";

type SubscriptionPlanSwitchProps = {
  isYear: boolean;
  setIsYear: React.Dispatch<React.SetStateAction<boolean>>;
};
const SubscriptionPlanSwitch = ({
  isYear,
  setIsYear,
}: SubscriptionPlanSwitchProps) => {
  const type = isYear ? "year" : "month";
  return (
    <div className="flex justify-center items-center mt-6 gap-3">
      <span
        className={cn("text-medium-gray cursor-pointer", {
          "font-medium text-black": type === "month",
        })}
        onClick={() => setIsYear(false)}
      >
        Monthly
      </span>
      <Switch
        checked={isYear}
        onCheckedChange={(val) => setIsYear(val)}
        className="data-[state=checked]:bg-primary-default"
      />
      <span
        className={cn("text-medium-gray cursor-pointer", {
          "font-medium text-black": type === "year",
        })}
        onClick={() => setIsYear(true)}
      >
        Yearly
      </span>
    </div>
  );
};

export default SubscriptionPlanSwitch;
