import React, { forwardRef } from "react";
import PromptImageCard from "@/modules/project/elements/PromptImageCard";
import ImageUpscale from "./ImageUpscale";
import { IProjectPrompt } from "@/modules/project/types/common.types";
import PromptInfo from "@/components/elements/PromptInfo";

type IPromptList = {
  prompt: IProjectPrompt;
  modelsObj: Record<string, string>;
  methodsObj: Record<string, string>;
  canvasId: number;
};

const PromptList = forwardRef<HTMLDivElement, IPromptList>(
  ({ prompt, modelsObj, methodsObj, canvasId }, lastMessageRef) => {
    const isImg2Img = prompt?.type === "IMG2IMG";
    const isMagic = prompt?.type === "MAGIC";
    const ref = React.useRef<HTMLDivElement>(null);
    const handleScrollIntoView = () => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    return (
      <div ref={lastMessageRef}>
        <PromptInfo
          prompt={prompt}
          modelsObj={modelsObj}
          methodsObj={methodsObj}
          isImg2Img={isImg2Img}
          isMagic={isMagic}
          matrixImage={
            isMagic ? prompt.images[0].imageUrl || undefined : undefined
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 prompt-list gap-6 mt-6">
          {prompt.images?.map((image, index) => {
            if (isMagic && index <= 1) return null;
            return (
              <PromptImageCard
                isEnlarged={prompt.type === "MAGIC" && index == 0}
                promptId={prompt.id}
                prompt={prompt}
                image={image}
                key={index}
                subProjectid={prompt.subProjectId.toString()}
                canvasId={canvasId.toString()}
                handleScrollIntoView={handleScrollIntoView}
              />
            );
          })}
        </div>
        <ImageUpscale
          promptId={prompt.id}
          canvasId={canvasId}
          ref={ref}
          bucketKey={prompt?.s3ImageBucketKey as string}
        />
      </div>
    );
  }
);
PromptList.displayName = "Prompt List";
export default PromptList;
