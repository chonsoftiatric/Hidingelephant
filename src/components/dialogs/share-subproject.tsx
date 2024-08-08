import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/common/button/Button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  ArrowUpRightSquareIcon,
  Copy,
  CopyCheck,
  ShareIcon,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  shareSubProject,
  ShareSubProjectResponse,
  toggleShareStatusRequest,
} from "@/actions/sub-project";
import toast from "react-hot-toast";
import { Card, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  subProjectId: number;
  isShared: boolean;
  shareHash?: string;
};

export default function ShareSubProjectDialog({
  subProjectId,
  isShared = false,
  shareHash,
}: Props) {
  const [shared, setShared] = React.useState(isShared);
  const [hashData, setHashData] = React.useState<
    ShareSubProjectResponse | undefined
  >(
    shareHash
      ? {
          shareHash: shareHash,
          url: `${process.env.NEXT_PUBLIC_APP_URL}/p/${subProjectId}/${shareHash}`,
        }
      : undefined
  );
  const [copied, setCopied] = React.useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: shareSubProject,
    onSuccess: (data) => {
      setHashData(data);
    },
  });
  const { mutateAsync: toggleShareStatus, isPending: togglingShareStatus } =
    useMutation({
      mutationFn: toggleShareStatusRequest,
      onSuccess: (data) => {
        setShared(data.isShared);
      },
    });

  const handleShare = async () => {
    const promise = mutateAsync(subProjectId);
    toast.promise(promise, {
      loading: "Sharing...",
      success: "Shared successfully",
      error: "Failed to share",
    });
  };

  const handleShareStatus = () => {
    const promise = toggleShareStatus(subProjectId);
    toast.promise(promise, {
      loading: "Updating...",
      success: "Updated successfully",
      error: "Failed to update",
    });
  };

  React.useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 2000);
    }
  }, [copied]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-4">
          <ShareIcon size={20} />
          <span className="hover:text-primary-default">Share</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Project Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Easily share your design project with others. Get a unique link to
            share this project, allowing others to see the entire content,
            including new images. You can disable the link at any time to
            control access.
          </p>

          <div className="p-3">
            <div className="flex items-center gap-2 mt-2">
              <span
                className={cn("text-sm", {
                  "font-semibold": !shared,
                })}
              >
                Disabled
              </span>
              <Switch
                defaultChecked={shared}
                disabled={togglingShareStatus}
                onCheckedChange={handleShareStatus}
                className="data-[state=checked]:bg-primary-default focus-visible:ring-primary-default"
              />
              <span
                className={cn("text-sm", {
                  "font-semibold": shared,
                })}
              >
                Enabled
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              type="url"
              value={hashData?.url}
              placeholder="project shared link"
              readOnly
              className="flex-1"
            />
            {hashData?.url ? (
              <div className="gap-1 flex ">
                <div
                  className="py-1 px-2 bg-gray-100 rounded-lg cursor-pointer flex justify-between flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(hashData.url);
                    setCopied(true);
                    toast.success("URL copied to the clipboard");
                  }}
                >
                  {copied ? (
                    <CopyCheck className="stroke-green-500" />
                  ) : (
                    <Copy />
                  )}
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        window.open(hashData.url, "_blank");
                      }}
                      className="bg-gray-100 self-center py-1 px-2 rounded-lg"
                    >
                      <ArrowUpRightSquareIcon />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Open in new tab</TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <Button
                onClick={handleShare}
                disabled={isPending}
                variant="default"
              >
                Create link
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
