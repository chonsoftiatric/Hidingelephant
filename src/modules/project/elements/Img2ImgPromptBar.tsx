import Button from "@/components/common/button/Button";
import LocalIcon from "@/components/icons/LocalIcon";
import { usePromptStore } from "@/store/prompt-settings";
import React from "react";
import { useImg2ImgMutation } from "../services/project.mutation";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { getImg2ImgPayload } from "../utils/index.utils";
import { IActiveImage } from "@/types/global.types";
import { IProjectPrompt } from "@/modules/project/types/common.types";
import { usePathname } from "next/navigation";
import useCanvasNodes from "@/hooks/useCanvasNodes";
import { cn } from "@/lib/utils";
import { DALL_E_MODEL } from "@/utils/CONSTANTS";

type Img2ImgPromptBarType = {
  subProjectId: string;
  image: IActiveImage;
  maskBase64?: string;
  sketchBase64?: string;
  className?: string;
  successCB?: (prompt?: IProjectPrompt) => void;
  closeDialog?: () => void;
};
const Img2ImgPromptBar = ({
  subProjectId,
  image,
  maskBase64,
  sketchBase64,
  className,
  successCB,
  closeDialog,
}: Img2ImgPromptBarType) => {
  const promptState = usePromptStore();
  const isGV = promptState.elephantBrain === "GV";
  const isDALL_E = promptState.elephantBrain === DALL_E_MODEL;
  const pathname = usePathname();
  const { handleAddNodes } = useCanvasNodes();

  // MUTATION
  const { mutateAsync, isPending } = useImg2ImgMutation(subProjectId);
  const handleImg2Img = () => {
    if (isGV) {
      promptState.setChangeModelMessageShow(true);
      toast.error(
        "feature not available for this model, please try a different model"
      );
      if (closeDialog) {
        closeDialog();
      }
      return;
    }
    if (isPending) return;
    if (!promptState.prompt) {
      return toast.error("Please provide a prompt");
    }
    const cacheImage = `${window.location.origin}/_next/image?url=${image.imageUrl}&w=640&q=75`;
    const payload = getImg2ImgPayload({
      promptState,
      imgUrl: sketchBase64 ? "" : isDALL_E ? image.imageUrl : cacheImage,
      maskBase64,
      sketchBase64: sketchBase64,
    });

    if (
      !payload.initImage &&
      !payload.sketchBase64 &&
      sketchBase64 !== undefined
    ) {
      return toast.error("Please select a sketch image");
    }

    const similarImagePromise = mutateAsync({
      payload,
      subProjectId,
      imageId: image.id,
    });

    if (closeDialog) {
      closeDialog();
    }
    const loadingMessage = sketchBase64
      ? "Generating sketch images..."
      : maskBase64
      ? "Generating mask images..."
      : "Generating similar images...";
    const successmessage = sketchBase64
      ? "Sketch images generated"
      : maskBase64
      ? "Mask images generated"
      : "Similar images generated";
    const errorFallbackMessage = sketchBase64
      ? "Sektch images generation failed"
      : maskBase64
      ? "Mask images generation failed"
      : "Simiar image generation failed";
    toast
      .promise(similarImagePromise, {
        loading: loadingMessage,
        success: successmessage,
        error: (err) => err?.statusText || errorFallbackMessage,
      })
      .then((data) => {
        const images = data.images;
        const prompt = data;
        if (pathname.includes("canvas")) {
          handleAddNodes({
            images: images.map((image) => ({ ...image, feedImage: undefined })),
            prompt,
          });
        }
        if (successCB) {
          successCB(data);
        }
      });
  };

  return (
    <div className={cn("flex gap-2 xl:gap-4 px-2 rounded-sm", className)}>
      <div className="flex gap-1  bg-[#F6F6F6] rounded-lg w-full pr-3 !border-none">
        <div
          className="flex-1 rounded-lg bg-[#F6F6F6] px-[13px] self-center
           relative"
        >
          <Input
            id="prompt-input"
            value={promptState.prompt}
            onChange={(e) => promptState.setPrompt(e.target.value)}
            className="bg-[#F6F6F6] outline-none border-none"
            placeholder="Enter your idea"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleImg2Img();
              }
            }}
          />
        </div>
      </div>
      <Button
        disabled={promptState.isLoading || isGV}
        leftIcon={<LocalIcon icon="magic-wand" />}
        className="p-6 rounded-xl hidden xl:flex w-full max-w-[200px] font-semibold text-md"
        onClick={handleImg2Img}
      >
        Generate
      </Button>
      <Button
        disabled={promptState.isLoading || isGV}
        leftIcon={<LocalIcon icon="magic-wand" />}
        className="p-6 rounded-lg w-full xl:hidden max-w-[75px] "
        onClick={handleImg2Img}
      ></Button>
    </div>
  );
};

export default Img2ImgPromptBar;
