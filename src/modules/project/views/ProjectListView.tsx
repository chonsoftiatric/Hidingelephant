"use client";
import React, { useRef } from "react";

import PromptList from "@/components/Dashboard/section/PromptList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "next/navigation";
import { ChevronDownIcon, ComponentIcon } from "lucide-react";
import BookmarkPopover from "@/modules/project/elements/BookmarkPopover";
import { useModelSettings } from "@/services/vercel-kv.service";
import { arrayToObj } from "@/utils/fn.frontend";
import VectorizePopover from "@/modules/project/elements/VectorizePopover";
import PromptSkeletonCard from "@/modules/project/elements/PromptSekeletonCard";
import { usePromptsList } from "@/modules/project/services/project.query";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePromptStore } from "@/store/prompt-settings";
import HidingStartHere from "@/components/elements/hiding-start-here";

const ProjectListView = ({ isLoading }: { isLoading: boolean }) => {
  const store = usePromptStore();
  const { data: modelSettings } = useModelSettings();
  const modelsObj = React.useMemo(() => {
    return arrayToObj(modelSettings?.models || []);
  }, [modelSettings]);
  const methodsObj = React.useMemo(() => {
    return arrayToObj(modelSettings?.methods || []);
  }, [modelSettings]);
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading: fetchingProjects } = usePromptsList(id);
  const bottomRef = useRef<HTMLDivElement>(null);

  const prompts = data?.prompts || [];
  const promptsLength = prompts?.length || 0;

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [promptsLength]);

  if (isLoading || fetchingProjects) {
    return (
      <ScrollArea className="h-[calc(100vh-56px)] w-full p-3">
        <div className="flex flex-col gap-20">
          {Array.from({ length: 3 }).map((_, index) => (
            <PromptSkeletonCard
              methodsObj={methodsObj}
              modelsObj={modelsObj}
              key={"skeleton-card" + index}
              imagesCount={3}
              store={store}
            />
          ))}
        </div>
      </ScrollArea>
    );
  }
  const canvasId = data?.canvasId as number;
  return prompts?.length ? (
    <ScrollArea className="h-[calc(100vh-56px)] w-full p-3">
      <BookmarkPopover subProjectId={prompts[0].subProjectId} />
      <VectorizePopover subProjectId={prompts[0].subProjectId} />
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/canvas/${canvasId}`}
            className="absolute card z-10 flex h-10 w-10 bg-white cursor-pointer  rounded-full justify-center items-center top-[115px] right-6"
          >
            <ComponentIcon
              size={24}
              className="hover:stroke-primary-default hover:fill-primary-default"
            />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Open Canvas View</TooltipContent>
      </Tooltip>
      <div className="flex flex-1 flex-col gap-20 relative">
        {prompts.map((prompt, index) => {
          // @ts-ignore
          if (prompt.isSkeleton) {
            return (
              <PromptSkeletonCard
                key={`prompt-${index}`}
                // @ts-ignore
                imagesCount={prompt.imageCount}
                withAnimation
                methodsObj={methodsObj}
                modelsObj={modelsObj}
                store={store}
              />
            );
          } else {
            return (
              <PromptList
                key={`prompt-${prompt.id}`}
                methodsObj={methodsObj}
                modelsObj={modelsObj}
                prompt={prompt}
                canvasId={canvasId}
              />
            );
          }
        })}
      </div>
      <div ref={bottomRef}></div>
      <button
        onClick={scrollToBottom}
        className="absolute flex h-9 w-9 border-[1px] bg-white cursor-pointer border-gray-300 rounded-full justify-center items-center bottom-4 left-[48%] z-10"
      >
        <ChevronDownIcon size={20} />
      </button>
    </ScrollArea>
  ) : (
    <HidingStartHere />
  );
};

export default ProjectListView;
