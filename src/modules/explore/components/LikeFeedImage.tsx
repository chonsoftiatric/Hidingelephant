import { Heart } from "lucide-react";
import { useFeedImageLikeToggle } from "../hooks/like.hooks";

interface ILikeFeedImageProps {
  iconSize: number;
  feedImageId: number;
  isLiked: number;
}

export const LikeFeedImage = (props: ILikeFeedImageProps) => {
  const { mutateAsync: toggleLike, isPending } = useFeedImageLikeToggle({
    id: props.feedImageId.toString(),
  });

  return (
    <button disabled={isPending}>
      <Heart
        size={props.iconSize}
        className={`${
          props.isLiked == 1
            ? "stroke-primary-default fill-primary-default"
            : "stroke-black"
        }  hover:stroke-primary-default hover:fill-primary-default`}
        onClick={() => toggleLike(props.feedImageId.toString())}
      />
    </button>
  );
};
