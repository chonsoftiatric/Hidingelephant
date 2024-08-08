"use client";

import React from "react";
import { useLogoMakerStore } from "@/store/logo-maker";
import { ShareImageModal } from "@/modules/explore/components/ShareImageModal";
import { cn } from "@/lib/utils";
import { IProjectImage } from "@/modules/project/types/common.types";
import {
  useImg2ImgMutation,
  useToggleBookmarkMutation,
} from "../services/project.mutation";
import toast from "react-hot-toast";
import { useGlobalStore } from "@/store/global";
import { HiDownload } from "react-icons/hi";
import { LuExpand } from "react-icons/lu";
import { HiOutlineBookmark } from "react-icons/hi";
import useFeatureAccess from "@/hooks/useFeatureAccess";
import saveAs from "file-saver";
import TooltipComp from "@/modules/explore/components/Tooltip";
import { usePromptStore } from "@/store/prompt-settings";
import { IPrompt } from "@/types/db.schema.types";
import { Wand2 } from "lucide-react";
import { ISubProjectByIdResponseModel } from "@/modules/project/types/api.response.types";
import { formattedPrompt } from "@/utils";
import useCanvasNodes from "@/hooks/useCanvasNodes";
import { MdOutlineDashboard } from "react-icons/md";

type IPromptCardIconGroup = {
  image: ISubProjectByIdResponseModel["prompts"][0]["images"][0];
  handleScrollIntoView: () => void;
  prompt: IPrompt;
  subProjectId: string;
  canvasId: string;
};
const PromptCardIconGroup = ({
  image,
  prompt,
  subProjectId,
  canvasId,
  handleScrollIntoView,
}: IPromptCardIconGroup) => {
  const promptState = usePromptStore();
  const isGV = promptState.elephantBrain === "GV";
  const { hasFeatureAccess } = useFeatureAccess();
  const { setPrompt } = usePromptStore();
  const { setBookmarkPopoverOpen, setGenerateSimilarImage } = useGlobalStore();
  const { mutateAsync, isPending } = useToggleBookmarkMutation();
  const { handleSendToCanvas } = useCanvasNodes(canvasId);
  const { setActiveItem } = useLogoMakerStore();
  const handleBookmark = () => {
    const toggleBookmarkPromise = mutateAsync({
      subProjectId: subProjectId,
      imageId: image.id.toString(),
      promptId: image.promptId,
    });
    const removing = image.subProjectBookmark;
    toast
      .promise(toggleBookmarkPromise, {
        loading: `${removing ? "Removing" : "Adding"} image to bookmarks...`,
        success: `Image ${removing ? "removed" : "added"}  to bookmarks`,
        error: `Bookmark ${removing ? "remove" : "add"} failed`,
      })
      .then(() => {
        setBookmarkPopoverOpen(true);
      });
  };

  const handleImageDownload = async () => {
    const access = hasFeatureAccess("download");
    if (!access) return;
    const res = await fetch(image.imageUrl);
    const blob = await res.blob();
    saveAs(blob, "image.png");
  };

  const handleGenerateSimilar = () => {
    // open generate similar popup
    const id = +subProjectId;
    if (isNaN(id)) {
      return toast.error("Invalid Sub Project ID");
    }
    setPrompt(formattedPrompt(prompt.prompt || image.generated_prompt));
    setGenerateSimilarImage({
      id: image.id.toString(),
      imageUrl: image.imageUrl,
      subProjectId: id,
    });
  };
  return (
    <div className="flex gap-2 flex-wrap h-full pt-4">
      <ShareImageModal
        subProjectId={subProjectId}
        imageUrl={image.imageUrl}
        isPrivate={image.isPrivate}
        imageId={image.id}
        feedImageId={image.feedImage?.id}
      />
      <TooltipComp
        button={
          <button
            disabled={isPending}
            onClick={() =>
              handleSendToCanvas({
                image: {
                  ...image,
                  feedImage: {
                    id: image.feedImage?.id,
                  },
                },
                prompt,
              })
            }
            className="bg-white h-10 w-10 flex justify-center items-center rounded-full cursor-pointer disabled:cursor-not-allowed"
          >
            <MdOutlineDashboard size={24} />
          </button>
        }
        text="Send to canvas"
      />
      <TooltipComp
        button={
          <button
            disabled={isPending}
            onClick={handleBookmark}
            className="bg-white h-10 w-10 flex justify-center items-center rounded-full cursor-pointer disabled:cursor-not-allowed"
          >
            <HiOutlineBookmark
              size={24}
              className={cn(
                "hover:stroke-primary-default hover:fill-primary-default",
                {
                  "stroke-primary-default fill-primary-default": Boolean(
                    image.subProjectBookmark
                  ),
                }
              )}
            />
          </button>
        }
        text="Bookmark for quick access"
      />

      <TooltipComp
        button={
          <button
            onClick={handleGenerateSimilar}
            disabled={promptState.isLoading || isGV}
            className="bg-white h-10 w-10 flex justify-center items-center rounded-full hover:text-primary-default disabled:cursor-not-allowed"
          >
            <Wand2 size={24} />
          </button>
        }
        text={
          promptState.isLoading || isGV
            ? "Please select a different model"
            : "Generate similar images"
        }
      />
      <TooltipComp
        text="Download this image"
        button={
          <button
            onClick={handleImageDownload}
            className="bg-white h-10 w-10 flex justify-center items-center rounded-full hover:text-primary-default"
          >
            <HiDownload size={26} />
          </button>
        }
      />
      <TooltipComp
        button={
          <button
            onClick={() => {
              setActiveItem({ image, prompt });
              setTimeout(() => {
                handleScrollIntoView();
              }, 100);
            }}
            className="bg-white h-10 w-10 flex justify-center items-center rounded-full hover:text-primary-default"
          >
            <LuExpand size={24} />
          </button>
        }
        text="Expand for more options"
      />
    </div>
  );
};

export default PromptCardIconGroup;
