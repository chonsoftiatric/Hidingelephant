"use client";

import Button from "@/components/common/button/Button";
import { SettingsIcon } from "lucide-react";
import React from "react";
import PromptSettings from "@/components/layout/LogoMaker/PromptSettings";
import Draggable from "react-draggable";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const PromptSettingDrawer = () => {
  return (
    <Sheet>
      <SheetTrigger className="z-[1000]">
        <Draggable
          bounds={{
            top: 0,
            left: -(window.innerWidth / 2 - 50),
            bottom: window.innerHeight - 150,
            right: window.innerWidth / 2 - 100,
          }}
          defaultClassName="z-[1000]"
        >
          <Button className="p-2 bg-white hover:bg-white border group">
            <SettingsIcon className="stroke-black group-hover:stroke-blue-500" />
          </Button>
        </Draggable>
      </SheetTrigger>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <PromptSettings />
      </SheetContent>
    </Sheet>
  );
};

export default PromptSettingDrawer;
