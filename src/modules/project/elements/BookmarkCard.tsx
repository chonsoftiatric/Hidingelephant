import { BookmarkIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { ISubProjectBookmarkWithImage } from "../types/common.types";
import { defaultBlurHash } from "../data/index.data";
import { useToggleBookmarkMutation } from "../services/project.mutation";
import toast from "react-hot-toast";
import { useReactFlow } from "reactflow";

type IBookmarkCard = {
  bookmark: ISubProjectBookmarkWithImage;
  closePopover: () => void;
  removeNodeBookmark?: (nodeId: string) => void;
};
const BookmarkCard = ({
  bookmark,
  closePopover,
  removeNodeBookmark,
}: IBookmarkCard) => {
  const { fitView } = useReactFlow();
  const { mutateAsync, isPending } = useToggleBookmarkMutation();
  const handleRemoveBookmark = () => {
    const toggleBookmarkPromise = mutateAsync({
      subProjectId: bookmark.subProjectId.toString(),
      imageId: bookmark.imageId.toString(),
      promptId: bookmark.promptId,
    }).then(() => {
      if (removeNodeBookmark) {
        removeNodeBookmark(`image-${bookmark.imageId}`);
      }
    });

    toast.promise(toggleBookmarkPromise, {
      loading: `Removing image to bookmarks...`,
      success: `Image removed  to bookmarks`,
      error: `Bookmark remove failed`,
    });
  };
  const zoomToNode = (nodeId: string) => {
    fitView({ nodes: [{ id: nodeId }], padding: 0.1 });
  };

  const handleScrollToItem = (imageId: number) => {
    zoomToNode(`image-${imageId}`);
    const item = document.getElementById(`image-id-${imageId}`);
    if (item) {
      item.scrollIntoView({ behavior: "smooth" });
      closePopover();
    }
  };
  return (
    <div
      onClick={() => handleScrollToItem(bookmark.imageId)}
      className="relative"
    >
      <button
        disabled={isPending}
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveBookmark();
        }}
        className="absolute top-3 right-3 bg-white/75 rounded-full p-1 disabled:cursor-not-allowed"
      >
        <BookmarkIcon
          className="stroke-primary-default fill-primary-default"
          size={16}
        />
      </button>
      <Image
        src={bookmark.image.imageUrl}
        alt=""
        height={150}
        width={150}
        placeholder="blur"
        blurDataURL={bookmark.image.blurHash || defaultBlurHash}
        className="rounded-xl"
      />
    </div>
  );
};

export default BookmarkCard;
