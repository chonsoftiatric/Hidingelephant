"use client";

import Image from "next/image";
import { ShareImageModal } from "./ShareImageModal";
import { LikeFeedImage } from "./LikeFeedImage";

interface ExploreImagePropsI {
  imageUrl: string;
  title: string;
  description: string;
  feedImageId: number;
  isLiked: number;
  onClick: (e: any) => void;
}

export const ExploreImage = (props: ExploreImagePropsI) => {
  return (
    <div className={"mx-auto relative rounded-xl group flex-1"}>
      <Image
        src={props.imageUrl}
        height={300}
        width={300}
        alt={props.description}
        className="rounded-xl w-full h-full"
      />
      <div className="hidden p-2 group-hover:flex flex-col absolute h-full w-full inset-0 bg-black/30 rounded-xl">
        <div
          className="flex justify-center items-center flex-1 gap-4"
          onClick={props.onClick}
        >
          <button className="bg-white  h-10 w-10 flex justify-center items-center rounded-full cursor-pointer">
            <LikeFeedImage
              iconSize={24}
              feedImageId={props.feedImageId}
              isLiked={props.isLiked}
            />
          </button>
          <ShareImageModal
            imageId={props.feedImageId}
            isPrivate={false}
            imageUrl={props.imageUrl}
            feedImageId={props.feedImageId}
          />
        </div>
        <div className="card p-2 rounded-lg bg-black/25 backdrop-blur-lg mt-auto">
          <p className="text-white text-sm sm:text-base">{props.title}</p>
        </div>
      </div>
    </div>
  );
};
