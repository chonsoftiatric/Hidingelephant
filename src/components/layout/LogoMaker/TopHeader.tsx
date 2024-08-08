"use client";

import React from "react";
import {
  ArrowLeftIcon,
  ChevronLeft,
  ChevronRight,
  MenuIcon,
  SettingsIcon,
} from "lucide-react";
import LocalIcon from "@/components/icons/LocalIcon";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useLogoMakerStore } from "@/store/logo-maker";
import LeftSidebar from "./LeftSidebar";
import PromptSettingsSidebar from "./PromptSettingsSidebar";
import LeftSidebarContent from "./LeftSidebarContent";

type ITopHeader = {
  hasPromptSettings?: boolean;
};
const TopHeader = ({ hasPromptSettings = true }: ITopHeader) => {
  const { activeItem, setActiveItem } = useLogoMakerStore();
  return (
    <div className="p-3 border-b-2 border-gray-200 px-5 xl:hidden">
      {activeItem ? (
        <button
          onClick={() => setActiveItem(undefined)}
          className="flex gap-2 items-center"
        >
          <ArrowLeftIcon size={20} />
          <span>Go Back</span>
        </button>
      ) : (
        <>
          <div className="flex justify-between xl:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button>
                  <MenuIcon />
                </button>
              </SheetTrigger>
              <SheetContent
                className="p-0 w-3/4 sm:w-[300px]"
                icon={<ChevronLeft />}
                side="left"
              >
                <LeftSidebarContent className="max-w-full" />
              </SheetContent>
            </Sheet>
            <span>Elephant Logo Company</span>
            {hasPromptSettings ? (
              <Sheet>
                <SheetTrigger asChild>
                  <button>
                    <SettingsIcon />
                  </button>
                </SheetTrigger>
                <SheetContent icon={<ChevronRight />} side="right">
                  <PromptSettingsSidebar
                    isDrawer={false}
                    className="max-w-full w-full"
                  />
                </SheetContent>
              </Sheet>
            ) : null}
          </div>
          <div className="w-full justify-between hidden xl:flex">
            <span>Elephant Logo Company</span>
            <button>
              <LocalIcon height={24} width={24} icon="dots-horizontal" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TopHeader;
