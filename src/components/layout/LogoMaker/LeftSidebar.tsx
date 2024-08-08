"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { motion } from "framer-motion";
import LeftSidebarContent from "./LeftSidebarContent";
import { cn } from "@/lib/utils";

type ILeftSidebar = {
  className?: string;
  isDrawer?: boolean;
};
const LeftSidebar = ({ className, isDrawer = false }: ILeftSidebar) => {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div
      className={cn(
        "relative xl:border-r-2 border-gray-200 flex max-w-[235px]",
        className
      )}
    >
      {isDrawer ? (
        <>
          <motion.div
            initial={{ width: 235 }}
            animate={{ width: open ? 235 : 60 }}
            className="flex-1 overflow-hidden"
          >
            <LeftSidebarContent open={open} />
          </motion.div>
          <div
            onClick={toggleDrawer}
            className="absolute flex h-8 w-8 border-[1px] bg-white cursor-pointer border-gray-300 rounded-full justify-center items-center top-[calc(50%-1.25rem)] -right-4 z-10"
          >
            {open ? (
              <ChevronLeftIcon size={20} />
            ) : (
              <ChevronRightIcon size={20} />
            )}
          </div>
        </>
      ) : (
        <LeftSidebarContent />
      )}
    </div>
  );
};

export default LeftSidebar;
