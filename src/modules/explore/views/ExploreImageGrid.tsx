"use client";
import { ExploreImage } from "../components/ExploreImage";
import { ImageDetailsSheet } from "./ImageDetailsSheet";
import { ImageToolbar } from "../components/ImageToolbar";
import { useState } from "react";
import { IFeedData } from "@/actions/feed/feed";

interface IExploreImageGridProps {
  feed: IFeedData;
}

export const ExploreImageGrid = ({ feed }: IExploreImageGridProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentFeedImage, setCurrentFeedImage] = useState<IFeedData[0]>(
    feed[0]
  );
  return (
    <>
      <ImageDetailsSheet
        open={isOpen}
        setOpen={setIsOpen}
        feedId={currentFeedImage?.feedImageId.toString()}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 px-8 sm:px-18 md:px-24 py-4">
        {feed.map((feedImage) => {
          return (
            <div key={feedImage.feedImageId}>
              <ExploreImage
                feedImageId={feedImage.feedImageId}
                title={feedImage.title}
                description={feedImage.description}
                imageUrl={feedImage.imageURL}
                isLiked={feedImage.isLiked}
                onClick={(e) => {
                  if (e.currentTarget != e.target) return;
                  setCurrentFeedImage(feedImage);
                  setIsOpen(true);
                }}
              />
              <ImageToolbar
                imageId={feedImage.feedImageId}
                imageTitle={feedImage.title}
                imageUser={`${feedImage.username}`}
                imageUserAvatar={`${feedImage.userImage}`}
                likeCount={feedImage.likes}
                isLiked={feedImage.isLiked}
                prompt={feedImage.prompt}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};
