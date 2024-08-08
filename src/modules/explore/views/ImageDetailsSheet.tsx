"use client";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { FeedImageDetails } from "./FeedImageDetails";

export const ImageDetailsSheet = (props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  feedId: string;
}) => {
  return (
    <Sheet open={props.open} onOpenChange={() => props.setOpen(!props.open)}>
      <SheetContent
        className="w-full h-[calc(100vh-4rem)] rounded-t-2xl overflow-clip"
        side={"bottom"}
      >
        <FeedImageDetails feedId={props.feedId} />
      </SheetContent>
    </Sheet>
  );
};
