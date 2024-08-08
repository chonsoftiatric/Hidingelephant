import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "next-share";
import toast from "react-hot-toast";

import { ArrowUpRightSquareIcon, Copy, CopyCheck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ShareToSocial = ({ imageId }: { imageId: number }) => {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/explore/${imageId}`;
  const [copied, setCopied] = useState<boolean>(false);
  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 2000);
    }
  }, [copied]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center font-bold text-2xl">
          Share this creation
        </DialogTitle>
        <DialogDescription className="px-8 pb-8">
          <div className="flex justify-center gap-8 mt-8 mb-12">
            <div className="bg-blue-50 flex h-12 w-12 rounded-full justify-center items-center">
              <FacebookShareButton
                url={url}
                quote={"🔥 Check out my creation on Hiding Elephant \n\n"}
                hashtag={"#HidingElephant"}
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
            </div>
            <div className="bg-blue-50 flex h-12 w-12 rounded-full justify-center items-center">
              <TwitterShareButton
                url={url}
                title={"🔥 Check out my creation on Hiding Elephant \n\n"}
                hashtags={["HidingElephant"]}
              >
                <TwitterIcon className="rounded-full" size={26} />
              </TwitterShareButton>
            </div>
          </div>
          {/* <Label className="text-xs">or copy link</Label> */}
          <div className="flex flex-1 justify-center gap-1">
            <div
              className="mt-2 py-1 px-2 bg-gray-100 rounded-lg cursor-pointer flex justify-between flex-1"
              onClick={() => {
                navigator.clipboard.writeText(url);
                setCopied(true);
                toast.success("URL copied to the clipboard", {
                  position: "bottom-center",
                });
              }}
            >
              <p>{url}</p>
              {copied ? <CopyCheck className="stroke-green-500" /> : <Copy />}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    window.open(url, "_blank");
                  }}
                  className="bg-gray-100 self-center py-1 px-2 mt-2 rounded-lg"
                >
                  <ArrowUpRightSquareIcon />
                </button>
              </TooltipTrigger>
              <TooltipContent>Open in new tab</TooltipContent>
            </Tooltip>
          </div>
        </DialogDescription>
      </DialogHeader>
    </>
  );
};
