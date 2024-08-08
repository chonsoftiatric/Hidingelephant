import React from "react";
import { useSubscription } from "@/services/user.service";
import PricingCards from "@/modules/project/elements/PricingCards";
import SubscriptionPlanSwitch from "@/modules/project/elements/SubscriptionPlanSwitch";
import BuyMoreCredit from "@/components/payment/BuyMoreCredit";

type UpgradePlanModalBodyProps = {
  loading: boolean;
};
const UpgradePlanModalBody = ({ loading }: UpgradePlanModalBodyProps) => {
  const { data: subscription } = useSubscription();
  const [isYear, setIsYear] = React.useState(true);
  if (!subscription) return null;
  return (
    <div className="mt-4">
      <div className="flex">
        <div className="flex-1">
          <SubscriptionPlanSwitch isYear={isYear} setIsYear={setIsYear} />
          <div className="mt-6 flex gap-6 justify-center">
            <PricingCards
              isSubscribed={subscription.type !== null}
              planName={subscription.name}
              planType={subscription.type}
              compact
              isYear={isYear}
              cardClassName="max-w-[300px]"
              withoutFree
            />
          </div>
        </div>
        <BuyMoreCredit className="max-w-[300px] mt-[70px]" loading={loading} />
      </div>
    </div>
  );
};

export default UpgradePlanModalBody;
