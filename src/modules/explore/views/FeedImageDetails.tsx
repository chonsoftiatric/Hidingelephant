import React from "react";
import { FeedImageDetailsHeader } from "../components/FeedImageDetailsHeader";
import { FeedImageComments } from "../components/FeedImageComments";
import Image from "next/image";
import { useGetFeedImage } from "../hooks/feed.hooks";
import { LoaderIcon } from "lucide-react";
import { PostCommentBox } from "../components/PostCommentBox";
import { useModelSettings } from "@/services/vercel-kv.service";
import { arrayToObj } from "@/utils/fn.frontend";
import PromptInfo from "@/components/elements/PromptInfo";

export const FeedImageDetails = ({ feedId }: { feedId: string }) => {
  const { data: modelSettings } = useModelSettings();
  const modelsObj = React.useMemo(() => {
    return arrayToObj(modelSettings?.models || []);
  }, [modelSettings]);
  const methodsObj = React.useMemo(() => {
    return arrayToObj(modelSettings?.methods || []);
  }, [modelSettings]);
  const { data: feed, isLoading } = useGetFeedImage({ id: feedId });

  return isLoading ? (
    <div className="h-full w-full flex justify-center items-center">
      <LoaderIcon className="animate-spin" />
    </div>
  ) : feed ? (
    <div className="grid lg:grid-cols-2 h-full w-full">
      <div className="p-4 flex flex-col items-center gap-6 justify-center">
        <Image
          src={feed.imageURL}
          alt=""
          className="rounded-xl mx-auto"
          sizes="100vw"
          width={512}
          height={512}
        />
        <div>
          <PromptInfo
            // @ts-ignore
            prompt={feed.prompt}
            isImg2Img={feed.prompt.type === "IMG2IMG"}
            isMagic={feed.prompt.type === "MAGIC"}
            methodsObj={methodsObj}
            modelsObj={modelsObj}
          />
        </div>
      </div>
      <div className="flex flex-col p-4">
        <FeedImageDetailsHeader feed={feed} />
        <div className="border-b py-8 mb-4">
          <p className="text-xl font-semibold">{feed.title}</p>
          <p>{feed.description}</p>
        </div>
        <p className="mb-4 font-semibold">Comments</p>
        <div className="mb-12 overflow-auto">
          <PostCommentBox feedImageId={feed.feedImageId} />
        </div>
        <div className="max-h-[450px] overflow-auto">
          <FeedImageComments id={feed.feedImageId.toString()} />
        </div>
      </div>
    </div>
  ) : (
    <p className="mx-auto text-center">Feed Image Not Found</p>
  );
};
