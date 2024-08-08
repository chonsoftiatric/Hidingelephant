import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ShareImageToExplore } from "./ShareImageToExplore";
import { ShareToSocial } from "@/common/components/ShareToSocial";
import { RiShareLine } from "react-icons/ri";
import TooltipComp from "./Tooltip";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IShareImageModalProps {
  subProjectId?: string;
  imageId: number;
  feedImageId?: number;
  imageUrl: string;
  imagePrompt?: string;
  isPrivate: boolean;
  className?: string;
  isDark?: boolean;
  updateCanvasNode?: (imageId: number, feedImageId: number) => void;
}

export const ShareImageModal = ({
  updateCanvasNode,
  className,
  isDark = false,
  ...props
}: IShareImageModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(
              "bg-white h-10 w-10 flex justify-center items-center rounded-full hover:text-primary-default",
              className,
              {
                "bg-gray-900 w-full rounded-md": isDark,
              }
            )}
            onClick={() => setIsOpen(true)}
          >
            <RiShareLine
              className={cn("", {
                "stroke-white fill-white": isDark,
              })}
              size={26}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>Share and get exposure</TooltipContent>
      </Tooltip>
      <DialogPortal>
        <DialogOverlay className="bg-black opacity-75" />
        <DialogContent className="p-0">
          <div className="w-full bg-gray-100 py-6 rounded-t-lg">
            <Image
              src={props.imageUrl}
              height={200}
              width={200}
              alt=""
              className="rounded-xl mx-auto"
            />
          </div>
          {props.feedImageId ? (
            <ShareToSocial imageId={props.feedImageId} />
          ) : props.subProjectId ? (
            <ShareImageToExplore
              imageId={props.imageId}
              imageDescription={props.imagePrompt}
              subProjectId={props.subProjectId}
              closeModal={() => setIsOpen(false)}
              open={() => {
                setIsOpen(true);
              }}
              updateCanvasNode={updateCanvasNode}
            />
          ) : null}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
