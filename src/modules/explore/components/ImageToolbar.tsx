import { IPrompt } from "@/types/db.schema.types";
import { ExploreUserAvatar } from "./ExploreUserAvatar";
import { LikeFeedImage } from "./LikeFeedImage";

interface IImageToolbarProps {
  imageId: number;
  imageTitle: string;
  imageUser: string;
  imageUserAvatar: string;
  likeCount: number;
  isLiked: number;
  prompt: IPrompt;
}
export const ImageToolbar = (props: IImageToolbarProps) => {
  return (
    <div className="py-[2px] flex justify-between items-center mt-2">
      <div className="flex items-center">
        <ExploreUserAvatar
          avatarSize="8"
          imageUrl={props.imageUserAvatar}
          username={props.imageUser}
        />
        <a
          className="text-sm font-semibold ml-4"
          href={`/designer/${props.imageUser}`}
        >
          {props.imageUser}
        </a>
      </div>
      <div className="flex items-center">
        <LikeFeedImage
          iconSize={16}
          feedImageId={props.imageId}
          isLiked={props.isLiked}
        />
        <p className="text-sm font-semibold ml-1">{props.likeCount}</p>
      </div>
    </div>
  );
};
