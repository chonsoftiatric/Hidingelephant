import { cn } from "@/lib/utils";
import React from "react";

type IBlurEffect = {
  className?: string;
  type?: "left" | "right";
  y?: "top" | "bottom";
};
const BlurEffect = ({ className, type = "left", y = "top" }: IBlurEffect) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-[50%]",
        className,
        {
          "-right-full sm:top-[5%]": type === "right",
          "top-0": y === "bottom",
        }
      )}
    >
      <div
        style={{
          clipPath:
            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
        }}
        className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
      />
    </div>
  );
};

export default BlurEffect;
