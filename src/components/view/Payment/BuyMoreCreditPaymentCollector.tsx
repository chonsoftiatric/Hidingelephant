"use client";
import React, { useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import ConfettiExplosion from "react-confetti-explosion";
import { usePathname } from "next/navigation";

// Types
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useUpdateBoughtCredit } from "@/services/credits.service";
import { queryClient } from "@/providers/TanstackProvider";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { useGlobalStore } from "@/store/global";
import { BuyMoreCreditPaymentIntentResponse } from "@/types/payment.types";

type IBuyMoreCreditsPaymentCollector = {
  data: BuyMoreCreditPaymentIntentResponse;
};
const BuyMoreCreditsPaymentCollector = ({
  data,
}: IBuyMoreCreditsPaymentCollector) => {
  const pathname = usePathname();
  const stripe = useStripe();
  const elements = useElements();
  const creditsAmount = data?.amount;
  const credisPrice = creditsAmount / 10;
  const { setCreditsThankYou } = useGlobalStore();

  // States
  const [isPaid, setIsPaid] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { mutateAsync, isPending } = useUpdateBoughtCredit();

  // Handlers
  const handleBoughtCreditUpdate = (paymentIntentId: string) => {
    const promise = mutateAsync(paymentIntentId);
    toast
      .promise(promise, {
        loading: "Updating credits...",
        success: "Credits updated successfully!",
        error: "Error updating credits!",
      })
      .then(() => {
        setCreditsThankYou(true);
        // invalidate the credits query
        const key = API_ROUTES.USER.GET_CREDIT;
        queryClient.invalidateQueries({
          queryKey: [key],
        });
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);
    const return_url = `${window.location.origin}/${pathname}`;
    try {
      const paymentRes = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: return_url,
        },
        redirect: "if_required",
      });
      if (paymentRes.paymentIntent?.status === "succeeded") {
        toast.success("Payment successful");

        // update the bought credits
        handleBoughtCreditUpdate(paymentRes.paymentIntent.id);
      }
    } catch (err) {
      if (err instanceof Error) {
        setIsPaid(false);
        toast.error(`Error: ${err.message}`);
      }
    } finally {
      setProcessing(false);
    }
  };
  const isLoading = processing || isPending;

  return (
    <div className="flex flex-col gap-y-4">
      {isPaid && (
        <div className="fixed left-0 top-0 flex w-full items-center justify-center">
          <ConfettiExplosion width={2000} />
        </div>
      )}
      <>
        <div className="flex flex-col gap-8 sm:flex-row">
          <div className="flex-1 max-w-[300px]">
            <h3 className="text-xl font-medium">Buy more credits checkout</h3>
            <p className=" font-medium">Credits: {creditsAmount}</p>
            <hr className="my-2" />
            <p className="font-medium">Total Amount: ${credisPrice}</p>
          </div>

          <div className="flex flex-1 flex-col gap-y-4">
            <PaymentElement />

            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Processing..." : `Pay $${credisPrice}`}
            </Button>
          </div>
        </div>
      </>
    </div>
  );
};

export default BuyMoreCreditsPaymentCollector;
