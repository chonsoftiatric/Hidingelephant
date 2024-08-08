import React from "react";
import { inputClassNames } from "@/components/ui/input";
import Button from "@/components/common/button/Button";
import { cn } from "@/lib/utils";
import Image from "next/image";

const WaitingList = () => {
  return (
    <div className="mt-6 flex gap-4 flex-col sm:flex-row">
      <form
        className="launchlist-form flex flex-wrap justify-center gap-2"
        action="https://getlaunchlist.com/s/H1Popn"
        method="POST"
      >
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className={cn(
            inputClassNames,
            "border-[1px] lg:w-[225px] border-primary-default rounded-full focus:border-2 placeholder:text-gray-900 !ring-0 !ring-white"
          )}
        />
        <Button
          leftIcon={
            <Image
              height={20}
              width={20}
              src="/icons/magic-wand.svg"
              alt="magic wand"
            />
          }
        >
          Join the Waiting List
        </Button>
      </form>
    </div>
  );
};

export default WaitingList;
