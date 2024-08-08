"use client";
import React from "react";
import Button from "@/components/common/button/Button";
import CrownIcon from "@/components/icons/CrownIcon";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/store/global";

const SubscribeModalBody = () => {
  const { setActiveModal } = useGlobalStore();
  const { push } = useRouter();
  return (
    <div className="mt-4">
      <div
        className={
          "flex flex-col justify-center items-center w-full rounded-lg p-4 gap-2 bg-primary-default text-white"
        }
      >
        <p className="text-lg font-bold">Subscribe Now</p>
        <p className="text-center">
          Unlock powerful features with our Pro upgrade today
        </p>

        <Button
          onClick={() => {
            setActiveModal(undefined);
            setTimeout(() => {
              push("/pricing");
            }, 500);
          }}
          className="bg-white text-black rounded-md mt-2 hover:bg-white"
        >
          <div className="flex justify-between gap-2 items-center">
            <CrownIcon className="stroke-primary-default stroke-2" />
            <span className="font-semibold text-primary-default">
              Subscribe
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default SubscribeModalBody;
