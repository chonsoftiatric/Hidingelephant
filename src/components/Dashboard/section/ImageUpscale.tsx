import { useLogoMakerStore } from "@/store/logo-maker";
import { XIcon } from "lucide-react";
import Image from "next/image";
import React, { forwardRef } from "react";
import ActiveItemBar from "@/modules/project/elements/ActiveItemBar";

type ImageUpscaleProps = {
  bucketKey: string;
  promptId: number;
  canvasId: number;
};

const ExpandedImageView = forwardRef<HTMLDivElement, ImageUpscaleProps>(
  ({ bucketKey, promptId, canvasId }, ref) => {
    const { activeItem, setActiveItem } = useLogoMakerStore();
    if (activeItem?.prompt?.id !== promptId) return null;

    return (
      <div
        ref={ref}
        className="flex flex-col justify-center items-center mt-10 w-full"
      >
        <div className="flex flex-col bg-[#F6F6F6] w-[90%] mx-auto rounded-3xl justify-center items-center p-8">
          <div className="flex w-full items-center justify-between">
            <span className="font-semibold text-xl">Expanded View</span>
            <button
              onClick={() => {
                setActiveItem(undefined);
              }}
            >
              <XIcon className="stroke-medium-gray" />
            </button>
          </div>

          <Image
            src={activeItem.image.imageUrl}
            height={400}
            width={400}
            alt=""
            className="rounded-3xl mt-10"
          />

          <ActiveItemBar
            image={activeItem.image}
            prompt={activeItem.prompt}
            canvasId={canvasId}
            saveKey={bucketKey}
          />
        </div>
      </div>
    );
  }
);
ExpandedImageView.displayName = "imageUpscale";
export default ExpandedImageView;
