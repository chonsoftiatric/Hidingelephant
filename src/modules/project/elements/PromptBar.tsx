"use client";
import { Generate } from "@/app/schema/generate";
import Button from "@/components/common/button/Button";
import LocalIcon from "@/components/icons/LocalIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useFeatureAccess from "@/hooks/useFeatureAccess";
import { cn } from "@/lib/utils";
import { usePromptStore } from "@/store/prompt-settings";
import { useVercelKV } from "@/store/vercel-kv";
import { PencilIcon, Settings2Icon, SparklesIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import MagicKeywordSettings from "@/components/common/sections/MagicKeywordSettings";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getValueWithOneSpace } from "@/utils/fn.frontend";
import {
  useDallEProjectGenerationMutation,
  useProjectGenerationMutation,
  useVertexProjectGenerationMutation,
} from "../services/project.mutation";
import { DALL_E_MODEL } from "@/utils/CONSTANTS";
import { LuImage } from "react-icons/lu";
import { useGlobalStore } from "@/store/global";
import { HandleAddNodesProps } from "@/modules/canvas/types/canvas.types";
const formSchema = z.object({
  keywords: z
    .object({
      keyword: z.string().min(1, "Please provide a keyword"),
      value: z
        .string()
        .min(1, "Please provide a value")
        .refine(
          (value) => {
            const values = value.split(",");
            return values.length <= 3;
          },
          {
            message: "Please provide only up to three comma-separated values",
          }
        ),
    })
    .array(),
});
export type IMagicKeywordForm = z.infer<typeof formSchema>;

type PromptBarProps = {
  handleAddNodes?: ({
    images,
    activeNodeId,
    prompt,
  }: HandleAddNodesProps) => void;
  initialSubProjectId?: number;
};
const PromptBar = ({ handleAddNodes, initialSubProjectId }: PromptBarProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<IMagicKeywordForm>({
    defaultValues: {
      keywords: [
        {
          keyword: "",
          value: "",
        },
      ],
    },
    resolver: zodResolver(formSchema),
  });
  const contentEditableRef = React.useRef<HTMLDivElement>(null);
  const cursorPositionRef = React.useRef<number>(0);

  const { setSketchImageDialogSubProjectId, setActiveSubProject } =
    useGlobalStore();
  const { hasFeatureAccess } = useFeatureAccess();
  const promptBarRef = React.useRef<HTMLDivElement>(null);
  const params = useParams();
  const subProjectId = params.id || initialSubProjectId;
  const id = subProjectId as string;

  const promptState = usePromptStore();
  const isGV = promptState.elephantBrain === "GV";
  const isDALL_E = promptState.elephantBrain === DALL_E_MODEL;

  const { modelSettings } = useVercelKV();
  const isPlaceholderVisible =
    (contentEditableRef.current?.textContent?.length || 0) > 0 ? false : true;

  const { mutateAsync } = useProjectGenerationMutation(params.id as string);
  const { mutateAsync: vertexMutateAsync } = useVertexProjectGenerationMutation(
    params.id as string
  );
  const { mutateAsync: dallEMutateAsync } = useDallEProjectGenerationMutation(
    params.id as string
  );

  const handleGenerate = () => {
    const hasAccess = hasFeatureAccess("generate-prompt");
    if (!hasAccess) return;
    if (!modelSettings) return;
    if (!promptState.prompt) {
      toast.error("Please enter a prompt");
      return;
    }

    const payload: Generate = {
      prompt: getValueWithOneSpace(promptState.prompt),
      negativePrompt: promptState.negativePrompt,
      seed: promptState.seed,
      cfg: promptState.cfg,
      elephantBrain: promptState.elephantBrain,
      elephantModel: promptState.elephantModel,
      numberOfImages: promptState.numberOfImages,
      quality: promptState.quality,
    };
    const generateLogoPromise = isGV
      ? vertexMutateAsync({ payload, id })
      : isDALL_E
      ? dallEMutateAsync({ payload, id })
      : mutateAsync({ payload, id });
    toast
      .promise(generateLogoPromise, {
        loading: "Generate logos...",
        success: "Logos generated",
        error: (err) => err?.response?.statusText || "Logo generation failed",
      })
      .then((data) => {
        const images = data.images;
        const prompt = data;
        if (handleAddNodes) {
          handleAddNodes({
            images: images.map((image) => ({ ...image, feedImage: undefined })),
            prompt,
          });
        }
      });
  };
  const magicPromptDisabled =
    !id ||
    promptState.prompt.length === 0 ||
    contentEditableRef.current?.textContent === "" ||
    isGV ||
    isDALL_E;

  const generateDisabled =
    !id ||
    promptState.prompt.length === 0 ||
    contentEditableRef.current?.textContent === "";

  const sketchImageDisabled = !id || isGV;

  const highlightKeywords = (text: string, keywords: string[]) => {
    const styles_config = [
      "text-red-500 border-red-500",
      "text-indigo-500 border-indigo-500",
      "text-yellow-500 border-yellow-500",
    ];
    let html = text;
    let i = 0;
    const replacedKeywords = new Set();
    for (const keyword of keywords) {
      if (!replacedKeywords.has(keyword)) {
        const styles = styles_config[i] || "";
        const regex = new RegExp(`(?<!<[^>]*>)${keyword}(?![^<]*>)`);
        html = html.replace(
          regex,
          `<span class="p-1 border-2 rounded-md ${styles}">${keyword}</span>`
        );
        replacedKeywords.add(keyword);
      }
      i++;
    }
    return html;
  };

  const handleHighlightedText = () => {
    if (contentEditableRef.current && promptState.keywordsArr.length) {
      const keywords = promptState.keywordsArr.map((item) => item.keyword);
      const cursorPosition =
        window?.getSelection()?.getRangeAt(0).startOffset || 0;
      cursorPositionRef.current = cursorPosition;
      const input = promptState.prompt;
      const highlightedText = highlightKeywords(input, keywords);
      contentEditableRef.current.innerHTML = highlightedText;

      // Set the cursor to the correct position
      const range = document.createRange();
      const selection = window.getSelection();

      // set the position
      if (contentEditableRef.current.childNodes.length === 1) {
        range?.setStart(
          contentEditableRef.current.childNodes[0],
          cursorPositionRef.current
        );
        range?.collapse(true);
      } else {
        // const currentNode = range.commonAncestorContainer;
        const currentNode = ""; // find the node the user is currently typing on
        const lastChild = contentEditableRef.current.lastChild;
        // @ts-ignore
        const length = lastChild?.length as number;
        if (lastChild) {
          range?.setStart(lastChild, length);
          range?.collapse(true);
        }
      }
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };
  const handlePromptChange = () => {
    const textContent = contentEditableRef.current?.textContent;
    if (textContent !== promptState.prompt && textContent) {
      contentEditableRef.current.textContent = "";
    }
  };

  React.useEffect(() => {
    if (promptState.prompt) {
      handleHighlightedText();
    }
  }, [promptState.prompt, promptState.keywordsArr]);

  React.useEffect(() => {
    handlePromptChange();
  }, [promptState.prompt]);

  React.useEffect(() => {
    if (promptBarRef.current) {
      promptBarRef.current.scrollIntoView();
    }
  }, []);
  React.useEffect(() => {
    if (contentEditableRef.current && id !== undefined) {
      contentEditableRef.current.focus();
    }
  }, [id]);
  const hasKeyword = promptState.keywordsArr.length > 0;

  return (
    <div ref={promptBarRef} className="flex gap-2 xl:gap-4 px-2 rounded-sm">
      <div className="flex gap-1  bg-[#F6F6F6] rounded-lg w-full pr-3 !border-none">
        <div className="flex flex-1">
          <div
            className="flex-1 rounded-lg bg-[#F6F6F6] px-[13px] self-center
           relative"
          >
            <div
              className={cn("outline-none", {
                "pointer-events-none": !id || hasKeyword,
              })}
              id="prompt-input"
              key="prompt-input"
              contentEditable={true}
              ref={contentEditableRef}
              onInput={(e) => {
                const textContent = e.currentTarget.textContent;
                if (textContent) {
                  promptState.setPrompt(textContent);
                } else {
                  promptState.setPrompt("");
                }
              }}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            ></div>
            {isPlaceholderVisible ? (
              <span
                key="prompt-input-placeholder"
                className={cn(
                  "text-sm text-medium-gray absolute top-1 pointer-events-none h-full"
                )}
              >
                Enter your idea...
              </span>
            ) : null}
          </div>
          {hasKeyword ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  disabled={promptState.isLoading}
                  onClick={() => {
                    form.reset();
                    promptState.setKeywordsArr([]);
                    promptState.setKeywords([]);
                    if (contentEditableRef.current) {
                      contentEditableRef.current.textContent =
                        promptState.prompt;
                    }
                  }}
                >
                  <PencilIcon
                    className={cn("text-green-500 cursor-pointer", {
                      "text-gray-300 cursor-not-allowed": magicPromptDisabled,
                    })}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>Edit Prompt</TooltipContent>
            </Tooltip>
          ) : null}
          <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    if (isGV) {
                      promptState.setChangeModelMessageShow(true);
                      toast.error(
                        "feature not available for this model, please try a different model"
                      );
                      return;
                    }
                    if (promptState.prompt.trim().split(" ").length === 1) {
                      return toast.error(
                        "Please provide a valid prompt with more than 1 word"
                      );
                    }
                    if (!magicPromptDisabled) {
                      setIsOpen(true);
                    }
                    setActiveSubProject(Number(id));
                  }}
                  disabled={magicPromptDisabled}
                  className="mr-2"
                >
                  <SparklesIcon
                    className={cn("text-primary-default cursor-pointer", {
                      "text-gray-300 cursor-not-allowed": magicPromptDisabled,
                    })}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>Magic Prompt</TooltipContent>
            </Tooltip>
            <DialogOverlay withOverlay={false} className="bg-white/25" />
            <DialogContent className="max-w-3xl">
              <MagicKeywordSettings
                closeDialog={() => setIsOpen(false)}
                form={form}
              />
            </DialogContent>
          </Dialog>
          <button
            disabled={sketchImageDisabled}
            onClick={() => setSketchImageDialogSubProjectId(Number(id))}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-1">
                  <LuImage
                    size={24}
                    className={cn("text-primary-default cursor-pointer", {
                      "text-gray-300 cursor-not-allowed": sketchImageDisabled,
                    })}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>Generate from sketch</TooltipContent>
            </Tooltip>
          </button>
        </div>
      </div>
      <Button
        disabled={promptState.isLoading || generateDisabled}
        leftIcon={<LocalIcon icon="magic-wand" />}
        className="p-6 rounded-xl hidden xl:flex w-full max-w-[200px] font-semibold text-md disabled:opacity-1 disabled:bg-gray-400"
        onClick={handleGenerate}
      >
        Generate
      </Button>
      <Button
        disabled={promptState.isLoading || generateDisabled}
        leftIcon={<LocalIcon icon="magic-wand" />}
        className="p-6 rounded-lg w-full xl:hidden max-w-[75px] disabled:opacity-1 disabled:bg-gray-400"
        onClick={handleGenerate}
      ></Button>
    </div>
  );
};

export default PromptBar;
