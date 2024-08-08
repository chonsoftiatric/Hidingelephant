"use client";
import { LatestGeneratedImages } from "@/actions/global";
import LiveFeedItem from "@/components/view/home/LiveFeedItem";
import { cn } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher-client";
import React from "react";
import { PUSHER_CHANNELS, PUSHER_EVENTS } from "@/utils/pusher.constants";
import Button from "@/components/common/button/Button";
import BlurEffect from "@/components/common/elements/BlurEffect";
import Link from "next/link";
import PromptSkeletonCard from "@/modules/project/elements/PromptSekeletonCard";
import { useModelSettings } from "@/services/vercel-kv.service";
import { arrayToObj } from "@/utils/fn.frontend";
import { usePromptStore } from "@/store/prompt-settings";

type Props = {
  data: LatestGeneratedImages;
  className?: string;
};
const LiveFeed = ({ data, className }: Props) => {
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
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  React.useEffect(() => {
    setTimeout(handleScroll, 2000);
  }, [prompts]);

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
    <section className={cn("mt-48 relative", className)}>
      <BlurEffect type="left" className="w-full" />
      <div className="p-2 border bg-gradient-to-tl rounded-3xl from-[#f8e8fc34] via-[#ded5f94a] to-[#cbd1fb3a]">
        <div className="py-2 flex justify-between px-8 pb-0">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Live Feed
            </h1>
            <p className="lg:text-lg">See what designers are making now</p>
          </div>
          <Link href={`/explore/live`}>
            <Button>View Live Feed</Button>
          </Link>
        </div>
        <div className="flex p-8 gap-20">
          <div className="w-[30%]">{/* Empty */}</div>
          <div className="flex-1">
            <div
              ref={scrollRef}
              className="h-[500px] overflow-auto no-scrollbar"
            >
              <div className="flex flex-col-reverse gap-4 pr-4 pt-2 pb-6">
                {prompts.map((prompt, index) => {
                  // @ts-ignore
                  if (prompt?.isSkeleton) {
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
                      <div key={`${prompt.id}-${index}`}>
                        <LiveFeedItem
                          prompt={prompt}
                          methodsObj={methodsObj}
                          modelsObj={modelsObj}
                        />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveFeed;
