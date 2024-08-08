import { cn } from "@/lib/utils";
import React from "react";
import PromptCardIconGroup from "./PromptCardIconGroup";
import NextImage from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { strWithoutLastWord } from "@/utils/fn.frontend";
import { defaultBlurHash } from "../data/index.data";
import { IProjectImage } from "@/modules/project/types/common.types";
import { IPrompt } from "@/types/db.schema.types";
import { formattedPrompt } from "@/utils";

type IPromptImageCard = {
  image: IProjectImage;
  promptId: number;
  prompt: IPrompt;
  handleScrollIntoView: () => void;
  isEnlarged?: boolean;
  subProjectid: string;
  canvasId: string;
};
const PromptImageCard = ({
  image,
  prompt,
  handleScrollIntoView,
  isEnlarged,
  subProjectid,
  canvasId,
}: IPromptImageCard) => {
  const imageUrl = image.imageUrl;
  return (
    <div
      id={`image-id-${image.id}`}
      className={cn("mx-auto relative rounded-xl group w-full h-full", {
        "prompt-card-enlarged col-span-1 sm:cols-span-2": isEnlarged,
      })}
    >
      <NextImage
        src={imageUrl}
        height={isEnlarged ? 1000 : 400}
        width={isEnlarged ? 1000 : 400}
        alt={prompt.prompt}
        placeholder="blur"
        blurDataURL={image.blurHash || defaultBlurHash}
        className="rounded-xl w-full h-full aspect-square object-contain"
      />
      <div className="hidden p-2 group-hover:flex flex-col absolute h-full w-full inset-0 bg-black/50 rounded-xl ease-in-out duration-150">
        <div className="flex justify-center items-center flex-1">
          <PromptCardIconGroup
            prompt={prompt}
            image={image}
            subProjectId={subProjectid}
            canvasId={canvasId}
            handleScrollIntoView={handleScrollIntoView}
          />
        </div>
        <div className="card p-2 bg-black/25 backdrop-blur-3xl mt-auto rounded-2xl">
          <ScrollArea className="h-[100px] p-2">
            <p className="text-white text-sm sm:text-base">
              {formattedPrompt(image.generated_prompt || prompt.prompt)}
            </p>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default PromptImageCard;
