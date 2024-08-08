import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { saveAs } from "file-saver";
import { IPrompt, Image as ImageType } from "@/types/db.schema.types";
import React from "react";
import useFeatureAccess from "@/hooks/useFeatureAccess";
import { useParams } from "next/navigation";
import { useGlobalStore } from "@/store/global";
import { usePromptStore } from "@/store/prompt-settings";
import { ActiveItemButton } from "./ActiveItemButton";
import { MdOutlineDashboard } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { HiDownload } from "react-icons/hi";
import { SplineIcon, WandIcon } from "lucide-react";
import useCanvasNodes from "@/hooks/useCanvasNodes";
import { formattedPrompt } from "@/utils";
import { DALL_E_MODEL } from "@/utils/CONSTANTS";

type IActiveItemBar = {
  className?: string;
  image: ImageType;
  saveKey: string;
  prompt: IPrompt;
  canvasId: number;
};

// @TODO: refactor on-click functions to new files
const ActiveItemBar = ({
  className,
  image,
  prompt,
  saveKey,
  canvasId,
}: IActiveItemBar) => {
  const params = useParams();
  const subProjectParamId = params.id as string;
  const { handleSendToCanvas } = useCanvasNodes(`${canvasId}`);

  const promptState = usePromptStore();
  const isGV = promptState.elephantBrain === "GV";
  const { hasFeatureAccess } = useFeatureAccess();

  const {
    updateVectorizeModal,
    updateEditImageModal,
    setGenerateSimilarImage,
  } = useGlobalStore();
  const { setPrompt } = usePromptStore();

  const handleImg2Img = () => {
    const subProjectId = +subProjectParamId;
    if (isNaN(subProjectId)) {
      return toast.error("Invalid Sub Project ID");
    }

    setPrompt(formattedPrompt(prompt.prompt || image.generated_prompt));
    setGenerateSimilarImage({
      id: image.id.toString(),
      imageUrl: image.imageUrl,
      subProjectId: subProjectId,
    });
  };

  const handleDownloadImage = async () => {
    const access = hasFeatureAccess("download");
    if (!access) return;
    const res = await fetch(image.imageUrl);
    const blob = await res.blob();
    saveAs(blob, "image.png");
  };

  return (
    <div className={cn("mt-10 p-8 bg-white card", className)}>
      <div className="flex gap-2 sm:gap-6 md:gap-8 items-center flex-wrap">
        <ActiveItemButton
          label="Send to Canvas"
          icon={
            <MdOutlineDashboard
              className="text-medium-gray group-hover:text-primary-default"
              size={20}
            />
          }
          onClick={async () => {
            handleSendToCanvas({
              image,
              prompt,
            });
          }}
        />
        <ActiveItemButton
          label="Generate Similar"
          icon={
            <WandIcon
              className="text-medium-gray group-hover:text-primary-hover"
              size={20}
            />
          }
          tooltip={isGV ? "Please select a different model" : undefined}
          disabled={isGV}
          onClick={handleImg2Img}
        />
        <ActiveItemButton
          label="Edit Design"
          icon={
            <BiEditAlt
              className="text-medium-gray group-hover:text-primary-default"
              size={22}
            />
          }
          tooltip={isGV ? "Please select a different model" : undefined}
          disabled={isGV}
          onClick={() => {
            promptState.setKeywords([]);
            promptState.setKeywordsArr([]);
            setPrompt(formattedPrompt(prompt.prompt || image.generated_prompt));
            updateEditImageModal({
              id: image.id.toString(),
              imageUrl: image.imageUrl,
            });
          }}
        />
        <ActiveItemButton
          label="Vectorize"
          icon={
            <SplineIcon
              className="text-medium-gray group-hover:text-primary-default"
              size={20}
            />
          }
          onClick={() => {
            const hasAccess = hasFeatureAccess("vectorize");
            if (!hasAccess) return;
            updateVectorizeModal({
              open: true,
              id: image.id,
              imageUrl: image.imageUrl,
              saveKey: saveKey,
              subProjectId: subProjectParamId,
            });
          }}
        />
        <ActiveItemButton
          label="Download"
          icon={
            <HiDownload
              className="text-medium-gray group-hover:text-primary-default"
              size={22}
            />
          }
          onClick={handleDownloadImage}
        />
      </div>
    </div>
  );
};

export default ActiveItemBar;
