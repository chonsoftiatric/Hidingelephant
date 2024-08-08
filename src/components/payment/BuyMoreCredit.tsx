import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store/global";
import React from "react";

type BuyMoreCreditProps = {
  loading: boolean;
  className?: string;
};
const BuyMoreCredit = ({ loading, className }: BuyMoreCreditProps) => {
  const disabled = loading;
  const { setCreditsToBuy } = useGlobalStore();
  return (
    <div
      className={cn(
        "flex flex-1 flex-col justify-center h-fit items-center w-full rounded-lg p-4 gap-2 bg-primary-default text-white",
        className
      )}
    >
      <p className="text-lg font-bold">Buy more credits</p>
      <p className="text-center">
        Purchase additional credits to keep generating logo ideas. Choose a
        credit package and proceed to checkout to continue your generations.
      </p>

      <div className="flex gap-2 items-center">
        <Button
          className="bg-white text-black  mx-auto rounded-md mt-2 hover:bg-white"
          onClick={() => {
            setCreditsToBuy(100);
          }}
        >
          <div className="flex justify-between gap-2 items-center">
            <span className="font-semibold text-primary-default">
              100 Credit - $10
            </span>
          </div>
        </Button>
        <Button
          className="bg-white text-black  mx-auto rounded-md mt-2 hover:bg-white"
          onClick={() => {
            setCreditsToBuy(50);
          }}
        >
          <div className="flex justify-between gap-2 items-center">
            <span className="font-semibold text-primary-default">
              50 Credit - $5
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default BuyMoreCredit;
