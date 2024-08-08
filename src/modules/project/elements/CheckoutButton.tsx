import Button from "@/components/common/button/Button";
import React from "react";

type ICheckoutButton = {
  isSubscribed: boolean;
  isSamePlan: boolean;
  handleCheckout: () => void;
};
const CheckoutButton = ({
  isSubscribed,
  isSamePlan,
  handleCheckout,
}: ICheckoutButton) => {
  return isSubscribed ? (
    <Button
      onClick={handleCheckout}
      className="w-[100%] md:w-[90%] mx-auto mt-6"
    >
      Manage Plan
    </Button>
  ) : (
    <Button
      onClick={handleCheckout}
      className="w-[100%] md:w-[90%] mx-auto mt-6"
    >
      Start Now
    </Button>
  );
};

export default CheckoutButton;
