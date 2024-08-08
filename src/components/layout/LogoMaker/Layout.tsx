"use client";
import React from "react";
import LeftSidebar from "@/components/layout/LogoMaker/LeftSidebar";
import PromptSettingsSidebar from "@/components/layout/LogoMaker/PromptSettingsSidebar";
import TopHeader from "@/components/layout/LogoMaker/TopHeader";
import Providers from "@/providers/Providers";
import { cn } from "@/lib/utils";

type ILogoMakerLayout = {
  children: React.ReactNode;
  hasPromptSettings?: boolean;
  className?: string;
};
const LogoMakerLayout = ({
  children,
  hasPromptSettings = true,
  className,
}: ILogoMakerLayout) => {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="flex h-full">
        <LeftSidebar isDrawer className="hidden xl:flex" />
        <div className="flex-1 h-full relative">
          <div className="flex flex-col pb-2 h-[100vh]">
            <TopHeader hasPromptSettings={hasPromptSettings} />
            {children}
          </div>
        </div>
        {hasPromptSettings ? (
          <PromptSettingsSidebar className="hidden xl:flex" />
        ) : null}
      </div>
    </div>
  );
};

export default LogoMakerLayout;
