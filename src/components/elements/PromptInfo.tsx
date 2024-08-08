import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IProjectPrompt } from "@/modules/project/types/common.types";
import { DALL_E_MODEL } from "@/utils/CONSTANTS";
import { BotIcon, LayoutGridIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

type PromptInfoProps = {
  modelsObj: Record<string, string>;
  methodsObj: Record<string, string>;
  prompt: IProjectPrompt;
  isImg2Img: boolean;
  isMagic: boolean;
  className?: string;
  matrixImage?: string;
};
const PromptInfo = ({
  prompt,
  modelsObj,
  methodsObj,
  isImg2Img,
  isMagic,
  matrixImage,
  className,
}: PromptInfoProps) => {
  const parentImage = prompt?.parentImage?.imageUrl || prompt.sketchImageUrl;
  const promptStr = prompt?.prompt.split("<")[0];
  const getModifiedNegativePromptStr = (str: string): string => {
    // @todo - handle negative prompt modification
    return str;
  };
  const withBorder = isMagic || isImg2Img;
  return (
    <div
      className={cn(
        "border-2 rounded-lg p-4 bg-white border-[#D7D7D7] flex justify-between items-center gap-4 relative",
        {
          "border-orange-500": withBorder,
        },
        className
      )}
    >
      {/* Matrix Icon */}
      {matrixImage ? (
        <Dialog>
          <DialogTrigger className="absolute top-2 right-2">
            <Tooltip>
              <TooltipTrigger>
                <div className="p-2 rounded-full shadow-lg border border-orange-500">
                  <LayoutGridIcon size={22} />
                </div>
              </TooltipTrigger>
              <TooltipContent>View Matrix Image</TooltipContent>
            </Tooltip>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <div>
              <Image
                src={matrixImage}
                height={750}
                width={750}
                className="h-full w-full"
                alt={prompt.prompt}
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
      <div>
        <div className="flex gap-2 items-center">
          <div>
            {parentImage ? (
              <Dialog>
                <DialogTrigger className="h-[40px] md:h-[50px] w-[40px] md:w-[50px]">
                  <Tooltip>
                    <TooltipTrigger>
                      <Image
                        src={parentImage}
                        alt={prompt.prompt}
                        height={50}
                        width={50}
                        className="rounded-full h-[40px] md:h-[50px] w-[40px] md:w-[50px]"
                      />
                    </TooltipTrigger>
                    <TooltipContent>Original Image</TooltipContent>
                  </Tooltip>
                </DialogTrigger>
                <DialogContent className="max-w-xl pt-10">
                  <DialogTitle>Original Image</DialogTitle>
                  <div>
                    <Image
                      src={parentImage}
                      height={500}
                      width={500}
                      className="h-full w-full rounded-xl"
                      alt={prompt.prompt}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            ) : null}
          </div>
          <div className="mr-20">
            <p className="mb-[2px] flex gap-3 items-center ml-1">
              <span className="font-medium">Prompt:</span> {promptStr}
            </p>
            <p>
              <BotIcon size={28} className="inline -mt-[6px] mr-2" />{" "}
              <span className="font-medium">Brain:</span>{" "}
              {modelsObj[prompt.apiName]},{" "}
              {prompt.samplerIndex !== "GV" &&
              prompt.samplerIndex !== DALL_E_MODEL ? (
                <span>
                  <span className="font-medium">Style:</span>{" "}
                  {methodsObj[prompt.samplerIndex]}
                </span>
              ) : null}{" "}
              <span className="font-medium">Images:</span> {prompt.batchSize},
              {prompt.steps ? (
                <span>
                  <span className="font-medium">Quality:</span> {prompt.steps}
                </span>
              ) : null}{" "}
              <span className="font-medium">CFG:</span> {prompt.cfgScale},{" "}
              <span className="font-medium">Seed:</span> {prompt.original_seed}{" "}
            </p>
          </div>
        </div>
        {prompt.negativePrompt ? (
          <p className="mt-[2px]">
            <span className="font-medium">Negative Prompt:</span>{" "}
            {getModifiedNegativePromptStr(prompt.negativePrompt)}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default PromptInfo;
