import Image from "next/image";
import React from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import ImageNodeActionBar from "@/modules/canvas/components/ImageNodeActionBar";
import { BotMessageSquare, InfoIcon, LucideExpand } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formattedPrompt } from "@/utils";
import PromptInfo from "@/components/elements/PromptInfo";
import { IProjectPrompt } from "@/modules/project/types/common.types";
import { cn } from "@/lib/utils";

export type ImageNodeData = {
  label: string;
  imageUrl: string;
  imageId: number;
  generatedPrompt: string | undefined;
  bookmarkId: number | undefined;
  promptId: number;
  isPrivate: boolean;
  feeddImageId: number | undefined;
} & Omit<IProjectPrompt, "bookmarkId" | "images" | "id" | "parentImage">;

export type ImageNodeProps = NodeProps<ImageNodeData> & {
  canvasId: string | number;
  subProjectId: string | number;
  modelObj: Record<string, string>;
  methodObj: Record<string, string>;
  saveKey: string;
  setActiveImage: React.Dispatch<
    React.SetStateAction<ImageNodeProps | undefined>
  >;
};

export const ImageNode = (props: ImageNodeProps) => {
  const { getNode, getEdges } = useReactFlow();
  const [withTargetHandle, setWithTargetHandle] = React.useState(false);
  const [withSourceHandle, setWithSourceHandle] = React.useState(false);
  const isPromptNode = props.id.includes("prompt");
  const isMagic = props.data?.type === "MAGIC";

  React.useEffect(() => {
    // get the node
    const node = getNode(props.id);
    if (node) {
      // find the edges where source or target is the current node
      let haveSourceHandle = false;
      let haveTargetHandle = false;
      getEdges().forEach((edge) => {
        // if both handle are present no need to keep the itineration
        if (withSourceHandle && withTargetHandle) return;

        // check the source and target handle
        if (edge.source === props.id) {
          haveSourceHandle = true;
        }
        if (edge.target === props.id) {
          haveTargetHandle = true;
        }
      });
      setWithSourceHandle(haveSourceHandle);
      setWithTargetHandle(haveTargetHandle);
    }
  }, []);

  return (
    <div>
      <Handle
        className={withTargetHandle ? "" : "opacity-0 pointer-events-none"}
        type="target"
        position={Position.Top}
        isConnectable={true}
      />

      <div>
        <div
          className={cn("border-2 rounded-lg", {
            "border-primary-default": props.selected,
          })}
        >
          <Popover>
            <PopoverTrigger className="flex justify-between relative h-[100px] w-[100px]">
              <div className="flex absolute justify-between pt-1 px-1 w-full z-10">
                {isPromptNode ? null : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          props.setActiveImage(props);
                        }}
                      >
                        <LucideExpand size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Expand Image</TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger onClick={(e) => e.preventDefault()}>
                    <InfoIcon size={18} />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isPromptNode ? (
                      <PromptInfo
                        // @ts-ignore
                        prompt={{
                          ...props.data,
                        }}
                        modelsObj={props.modelObj}
                        methodsObj={props.methodObj}
                        isImg2Img={props.data.type === "MAGIC"}
                        className="max-w-[500px] [&>div>*]:text-start"
                      />
                    ) : (
                      formattedPrompt(
                        isMagic
                          ? props.data.generatedPrompt || props.data.prompt
                          : props.data.prompt || ""
                      )
                    )}
                  </TooltipContent>
                </Tooltip>
              </div>
              {isPromptNode ? (
                props.data.sketchImageUrl ? (
                  <Image
                    alt={props.data.label}
                    src={props.data.sketchImageUrl}
                    className="rounded-lg w-full h-full object-cover"
                    layout="fill"
                  />
                ) : (
                  <BotMessageSquare size={100} className="p-3" />
                )
              ) : (
                <Image
                  alt={props.data.label}
                  src={props.data.imageUrl}
                  className="rounded-lg w-full h-full"
                  layout="fill"
                />
              )}
            </PopoverTrigger>
            {!isPromptNode ? (
              <PopoverContent>
                <ImageNodeActionBar {...props} />
              </PopoverContent>
            ) : null}
          </Popover>
        </div>
      </div>

      <Handle
        className={withSourceHandle ? "" : "opacity-0 pointer-events-none"}
        type="source"
        position={Position.Bottom}
        isConnectable={true}
      />
    </div>
  );
};
