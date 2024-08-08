"use client";
import React from "react";
import Button from "@/components/common/button/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
const WaitingList = dynamic(
  () => import("@/components/common/sections/WaitingList")
);
import dynamic from "next/dynamic";
import { DialogTitle } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";
const JoinWaitingListButton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("", className)}>
      <Dialog>
        <DialogTrigger asChild>
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
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Something special is coming!</DialogTitle>
          </DialogHeader>
          <div className="flex max-sm:justify-center flex-col items-center">
            <h3 className="title">Ai Logo Design</h3>
            <p className="text-center">
              We’re building the best collaborative AI logo design tool for
              professional designers. Be among the first to check it out.
            </p>
            <WaitingList />
            <Image
              src="/images/waiting-list.jpg"
              height={400}
              width={400}
              className="mt-5"
              alt="hiding elephant ai logo maker"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JoinWaitingListButton;
