import { getUserSubscriptionPlan } from "@/lib/stripe";
import PricingCardList from "@/modules/project/elements/PricingCardList";
import { notFound } from "next/navigation";

const PricingPage = async () => {
  if (2 > 1) {
    notFound();
  }
  const subscription = await getUserSubscriptionPlan();
  return (
    <div className="p-5 mt-8 overflow-hidden">
      <PricingCardList
        isSubscribed={subscription.type !== null}
        planName={subscription.name}
        planType={subscription.type}
      />
    </div>
  );
};

export default PricingPage;
