"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";
import { Toaster } from "react-hot-toast";
import TanstackProvider from "@/providers/TanstackProvider";
import SessionProvider from "@/providers/SessionProvider";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { ReactFlowProvider } from "reactflow";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <TanstackProvider>
        {/* <PosthogProvider> */}
        <SessionProvider>
          <TooltipProvider delayDuration={0}>
            <ReactFlowProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </ReactFlowProvider>
          </TooltipProvider>
        </SessionProvider>
        {/* </PosthogProvider> */}
      </TanstackProvider>
      <Toaster />
    </>
  );
};

export default Providers;
