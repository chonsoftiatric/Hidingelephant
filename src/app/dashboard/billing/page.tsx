import BillingForm from "@/components/Dashboard/section/BillingForm";
import PublicLayout from "@/components/layout/PublicLayout";
import { getUserSubscriptionPlan } from "@/lib/stripe";

const BillingPage = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();
  return (
    <PublicLayout>
      <BillingForm subscriptionPlan={subscriptionPlan} />
    </PublicLayout>
  );
};

export default BillingPage;
