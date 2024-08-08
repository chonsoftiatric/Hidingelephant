"use client";
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/loadStripe";
import BuyMoreCreditsPaymentCollector from "@/components/view/Payment/BuyMoreCreditPaymentCollector";
import { BuyMoreCreditPaymentIntentResponse } from "@/types/payment.types";

type BuyMoreCreditsCheckoutProps = {
  data: BuyMoreCreditPaymentIntentResponse;
};
const BuyMoreCreditCheckout = ({ data }: BuyMoreCreditsCheckoutProps) => {
  if (!data.paymentIntentSecret) return <></>;
  return (
    <form>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret: data.paymentIntentSecret,
        }}
      >
        {/* Buy more credit payment collector */}
        <BuyMoreCreditsPaymentCollector data={data} />
      </Elements>
    </form>
  );
};

export default BuyMoreCreditCheckout;
