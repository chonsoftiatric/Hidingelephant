"use client";
import { LatestGeneratedImages } from "@/actions/global";
import LiveFeedItem from "@/components/view/home/LiveFeedItem";
import { cn } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher-client";
import React from "react";
import { PUSHER_CHANNELS, PUSHER_EVENTS } from "@/utils/pusher.constants";
import PromptBar from "@/modules/project/elements/PromptBar";
import { ISubProject } from "@/types/db.schema.types";
import { useModelSettings } from "@/services/vercel-kv.service";
import { arrayToObj } from "@/utils/fn.frontend";
import PromptSkeletonCard from "@/modules/project/elements/PromptSekeletonCard";
import { usePromptStore } from "@/store/prompt-settings";
import { PromptWithMetadata } from "@/types/db.types";
import { formattedSubProjectName } from "@/utils";
import Button from "@/components/common/button/Button";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Props = {
  data: PromptWithMetadata[];
  subProject: ISubProject;
  className?: string;
};
const SubProjectLiveFeed = ({ data, className, subProject }: Props) => {
  const session = useSession();
  const subProjectName = formattedSubProjectName(subProject.name);
  const { data: modelSettings } = useModelSettings();
  const modelsObj = React.useMemo(() => {
    return arrayToObj(modelSettings?.models || []);
  }, [modelSettings]);
  const methodsObj = React.useMemo(() => {
    return arrayToObj(modelSettings?.methods || []);
  }, [modelSettings]);

  const store = usePromptStore();

  const [prompts, setPrompts] = React.useState<PromptWithMetadata[]>(data);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  React.useEffect(() => {
    setTimeout(handleScroll, 2000);
  }, [prompts, store.isLoading]);

  React.useEffect(() => {
    const channel = pusherClient
      .subscribe(PUSHER_CHANNELS.GENERATIONS)
      .bind(
        PUSHER_EVENTS.IMAGE_GENERATED,
        (data: { prompt: PromptWithMetadata }) => {
          const prompt = data.prompt;
          if (prompt.subProjectId === subProject.id) {
            setPrompts([...prompts, prompt]);
          }
        }
      );

    return () => {
      channel.unbind();
    };
  }, []);

  return (
    <section className={cn("relative", className)}>
      <div className="flex gap-6">
        {/* Live Feed */}
        <div className="flex-1 order-2 relative">
          <div
            ref={scrollRef}
            className={cn(
              "h-[calc(100vh-64px)] overflow-auto no-scrollbar",
              {}
            )}
          >
            <div className="flex flex-col-reverse gap-4">
              {store.isLoading ? (
                <PromptSkeletonCard
                  key={`prompt-skeleton`}
                  // @ts-ignore
                  imagesCount={prompt.imageCount}
                  withAnimation
                  methodsObj={methodsObj}
                  modelsObj={modelsObj}
                  store={store}
                />
              ) : null}
              {prompts.map((prompt, index) => (
                <div key={`${prompt.id}-${index}`}>
                  <LiveFeedItem
                    prompt={prompt}
                    methodsObj={methodsObj}
                    modelsObj={modelsObj}
                    size="lg"
                    className="p-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Chat */}
        <div className="w-[20%] order-1 hidden md:block">
          <div className="h-[calc(100vh-64px)] overflow-auto no-scrollbar w-full flex flex-col gap-2 pb-4">
            <div className="max-w-3xl w-full h-full mx-auto p-6 bg-white rounded-lg flex flex-col">
              <div className="flex-1">
                <h1 className="text-lg md:text-xl lg:text-2xl font-semibold">
                  {subProjectName}
                </h1>
                <p>
                  Check out the logos created for {subProjectName}. New designs
                  will appear as they are created.
                </p>
              </div>
              {session.status !== "authenticated" ? (
                <div className="mt-auto">
                  <Link href="/login">
                    <Button>Design with HidingElephant</Button>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {/* End */}
      </div>
    </section>
  );
};

export default SubProjectLiveFeed;
