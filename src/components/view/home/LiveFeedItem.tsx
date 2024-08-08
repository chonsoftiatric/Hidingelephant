"use client";
import { LatestGeneratedImages } from "@/actions/global";
import PromptInfo from "@/components/elements/PromptInfo";
import { cn } from "@/lib/utils";
import { useModelSettings } from "@/services/vercel-kv.service";
import { arrayToObj } from "@/utils/fn.frontend";
import Image from "next/image";
import React from "react";

type Props = {
  prompt: LatestGeneratedImages["prompts"][0];
  size?: "sm" | "md" | "lg";
  modelsObj: Record<string, string>;
  methodsObj: Record<string, string>;
  className?: string;
};

const LiveFeedItem = ({
  prompt,
  size = "md",
  modelsObj,
  methodsObj,
  className,
}: Props) => {
  const isImg2Img = prompt?.type === "IMG2IMG";
  const isMagic = prompt?.type === "MAGIC";

  return (
    <div className={cn("p-3 rounded-xl", className)}>
      <PromptInfo
        prompt={prompt}
        isImg2Img={isImg2Img}
        isMagic={isMagic}
        methodsObj={methodsObj}
        modelsObj={modelsObj}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 py-4">
        {prompt.images.map((image, index) => {
          if (isMagic && index <= 1) return null;
          return (
            <div
              key={`${image.id}-${index}`}
              className={cn("relative h-[175px]", {
                "h-[350px]": size === "lg",
              })}
            >
              <Image
                src={image.imageUrl}
                fill
                alt="search result"
                className="rounded-xl object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                blurDataURL={image.blurHash}
                placeholder="blur"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveFeedItem;
