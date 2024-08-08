"use client";

import { ChevronLeftIcon, ChevronRightIcon, CogIcon } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import PromptSettings from "./PromptSettings";
import { cn } from "@/lib/utils";

type IPromptSettingsSidebar = {
  className?: string;
  isDrawer?: boolean;
};
const PromptSettingsSidebar = ({
  className,
  isDrawer = true,
}: IPromptSettingsSidebar) => {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div
      className={cn(
        "relative xl:border-l-2 border-gray-200 flex max-w-[270px]",
        className
      )}
    >
      {isDrawer ? (
        <>
          <motion.div
            initial={{ width: 320 }}
            animate={{ width: open ? 320 : 20 }}
            className="flex-1"
          >
            {open ? <PromptSettings /> : null}
          </motion.div>
          <div
            onClick={toggleDrawer}
            className="absolute flex h-9 w-9 border-[1px] bg-white cursor-pointer border-gray-300 rounded-full justify-center items-center top-[calc(50%-1.25rem)] -left-5"
          >
            {open ? <ChevronRightIcon size={20} /> : <ChevronLeftIcon size={24}/>}
          </div>
        </>
      ) : (
        <PromptSettings />
      )}
    </div>
  );
};

export default PromptSettingsSidebar;
