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

type Props = {
  data: LatestGeneratedImages;
  subProject: ISubProject | undefined;
  className?: string;
};
const ExploreLiveFeed = ({ data, className, subProject }: Props) => {
  const { data: modelSettings } = useModelSettings();
  const modelsObj = React.useMemo(() => {
    return arrayToObj(modelSettings?.models || []);
  }, [modelSettings]);
  const methodsObj = React.useMemo(() => {
    return arrayToObj(modelSettings?.methods || []);
  }, [modelSettings]);

  const store = usePromptStore();

  const [prompts, setPrompts] = React.useState<
    LatestGeneratedImages["prompts"]
  >(data.prompts);
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
        (data: { prompt: LatestGeneratedImages["prompts"][0] }) => {
          const prompt = data.prompt;
          setPrompts([prompt, ...prompts]);
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
            <div className="flex flex-col gap-4">
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
          {subProject ? (
            <div className="absolute bottom-2 w-full">
              <div className="max-w-3xl w-full mx-auto">
                <PromptBar initialSubProjectId={subProject.id} />
              </div>
            </div>
          ) : null}
        </div>
        {/* Chat */}
        <div className="w-[20%] order-1 hidden md:block">
          <div className="h-[calc(100vh-64px)] overflow-auto no-scrollbar w-full flex flex-col gap-2 pb-4">
            <div className="max-w-3xl w-full h-full mx-auto p-6 bg-white rounded-lg ">
              <h1 className="text-lg font-semibold">
                Hiding Elephant Live Feed
              </h1>
              <ul className="list-disc ml-4 text-sm space-y-3 mt-6">
                <li>
                  <strong>Watch Real-Time Creations:</strong> Check out new
                  logos being made live by our awesome community of designers.
                  See fresh designs come to life right in front of you.
                </li>
                <li>
                  <strong>Generate Live Logos:</strong> Jump in and create logos
                  live on this page. Your designs will show up in the feed and
                  be saved in your Playground project.
                </li>
                <li>
                  <strong>Learn from Others:</strong> Discover the models and
                  prompts other users are trying out. Pick up new tips and get
                  inspired for your own designs.
                </li>
                <li>
                  <strong>Stay Inspired:</strong> Keep your creative juices
                  flowing by watching the ever-changing stream of live logo
                  creations.
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* End */}
      </div>
    </section>
  );
};

export default ExploreLiveFeed;
