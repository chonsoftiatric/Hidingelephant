"use client";

import LabelInfo from "@/components/common/LabelInfo";
import { cn } from "@/lib/utils";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePromptStore } from "@/store/prompt-settings";
import { DALL_E_MODEL } from "@/utils/CONSTANTS";
const LogosToGenerate = () => {
  const promptState = usePromptStore();
  const isGV = promptState.elephantBrain === "GV";
  const isDALL_E = promptState.elephantBrain === DALL_E_MODEL;
  const options = isGV ? [3] : isDALL_E ? [3, 6, 9] : [3, 6, 9, 12];
  const { numberOfImages, setNumberOfImages } = usePromptStore();

  React.useEffect(() => {
    if (isGV && numberOfImages > 3) {
      setNumberOfImages(3);
    }
    if (isDALL_E && numberOfImages > 9) {
      setNumberOfImages(3);
    }
  }, [isGV, isDALL_E]);
  return (
    <div className="">
      <LabelInfo
        label="Logos to generate"
        infoText="Choose how many logos you want to generate in a batch. Note that generating more logos in a batch will cost more credits."
      />
      <AnimatePresence>
        <div className="flex gap-3 flex-wrap mt-2 max-w-[250px]">
          {options.map((option) => (
            <motion.button
              onClick={() => setNumberOfImages(option)}
              key={`generate-${option}`}
              className={cn(
                "flex justify-center items-center h-12 w-12 rounded-md card  ring-1 ring-gray-300",
                numberOfImages === option
                  ? "bg-primary-default ring-primary-default text-white font-bold"
                  : ""
              )}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default LogosToGenerate;
