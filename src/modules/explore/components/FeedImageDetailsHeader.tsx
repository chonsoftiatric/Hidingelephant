import { ExploreUserAvatar } from "@/modules/explore/components/ExploreUserAvatar";
import { LikeFeedImage } from "./LikeFeedImage";
import { ShareImageModal } from "./ShareImageModal";
import { timeAgo } from "@/common/utils/timeAgo";
import { IFeed } from "../types/feed.types";

interface IFeedImageDetailsHeaderProps {
  feed: IFeed;
}

export const FeedImageDetailsHeader = ({
  feed,
}: IFeedImageDetailsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <ExploreUserAvatar
          avatarSize="12"
          username={feed.username}
          imageUrl={feed.userImage || undefined}
        />
        <div className="text-left">
          <a
            className="text-sm md:text-base font-semibold"
            href={`/designer/${feed.username}`}
          >
            {feed.username}
          </a>
          <p className="text-xs">{timeAgo(new Date(feed.postedAt))}</p>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          <LikeFeedImage
            feedImageId={feed.feedImageId}
            iconSize={24}
            isLiked={feed.isLiked}
          />
          <p>{feed.likes}</p>
        </div>
        <ShareImageModal
          imageId={feed.feedImageId}
          imageUrl={feed.imageURL}
          feedImageId={feed.feedImageId}
          isPrivate={false}
        />
      </div>
    </div>
  );
};
