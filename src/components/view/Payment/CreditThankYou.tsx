import Button from "@/components/common/button/Button";
import { useCreditDetails } from "@/services/user.service";
import { BuyMoreCreditPaymentIntentResponse } from "@/types/payment.types";
import { Coins } from "lucide-react";
import React from "react";

type CreditsThankYouProps = {
  data: BuyMoreCreditPaymentIntentResponse;
  closeModal: () => void;
};
const CreditsThankYou = ({ data, closeModal }: CreditsThankYouProps) => {
  const { data: credits } = useCreditDetails();
  const addedCredits = data.amount;
  const updatedCredits = credits?.remainingCredits || 0;
  const prevCredits = updatedCredits - addedCredits;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-background rounded-md">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Thank you for your purchase</h2>
        <div className="space-y-2 flex flex-col items-center justify-center">
          <p className="flex gap-2 items-center">
            Your previous credits:{" "}
            <span className="font-semibold flex gap-2 items-center">
              {" "}
              <Coins color="#FFD700" /> {prevCredits.toFixed(2)}
            </span>
          </p>
          <p className="flex gap-2 items-center">
            Your new credits:{" "}
            <span className="font-semibold flex gap-2 items-center">
              <Coins color="#FFD700" /> {updatedCredits.toFixed(2)}
            </span>
          </p>
        </div>
        <Button onClick={closeModal}>Continue Generating</Button>
      </div>
    </div>
  );
};

export default CreditsThankYou;
