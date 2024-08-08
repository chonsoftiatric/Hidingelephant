"use client";

import { getUserSubscriptionPlan } from "@/lib/stripe";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { createStripeSession } from "@/services/stripe.service";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface BillingFormProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {
  const { push } = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: createStripeSession,
    onSuccess: (data) => {
      window.location.href = data.url ?? "/dashboard/billing";
    },
    onError: () => {
      toast.error("There was an error creating the subscription");
    },
  });
  return (
    <div className="max-w-5xl mx-auto">
      <form
        className="pt-12"
        onSubmit={(e) => {
          e.preventDefault();
          if (
            subscriptionPlan.isSubscribed &&
            subscriptionPlan.type &&
            subscriptionPlan.name
          ) {
            mutate({
              plan_duration: subscriptionPlan.type as "month" | "year",
              plan_name: subscriptionPlan.name,
            });
          } else {
            // route to pricing page
            push("/pricing");
          }
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the <strong>{subscriptionPlan.name}</strong>{" "}
              plan.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            <Button type="submit">
              {isPending ? (
                <Loader2 className="mr-4 h-4 w-4 animate-spin" />
              ) : null}
              {!subscriptionPlan.type ? "Upgrade Plan" : "Manage Subscription"}
            </Button>

            {subscriptionPlan.type ? (
              <p className="rounded-full text-xs font-medium">
                {subscriptionPlan.isCanceled
                  ? "Your plan will be canceled on "
                  : "Your plan renews on "}
                {format(subscriptionPlan.stripeCurrentPeriodEnd!, "dd.MM.yyyy")}
                .
              </p>
            ) : null}
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default BillingForm;
