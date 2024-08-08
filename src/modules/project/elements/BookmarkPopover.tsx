import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import BookmarkCard from "./BookmarkCard";
import { useSubProjectBookmarks } from "@/modules/project/services/project.query";
import Loader from "@/components/common/elements/Loader";
import { useGlobalStore } from "@/store/global";
import { HiOutlineBookmark } from "react-icons/hi";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const BookmarkPopover = ({
  subProjectId,
  className,
  iconClassName,
  removeNodeBookmark,
}: {
  subProjectId: number;
  className?: string;
  iconClassName?: string;
  removeNodeBookmark?: (nodeId: string) => void;
}) => {
  const { bookmarkPopoverOpen, setBookmarkPopoverOpen } = useGlobalStore();
  const { data, isLoading } = useSubProjectBookmarks(subProjectId);
  return (
    <Popover open={bookmarkPopoverOpen} onOpenChange={setBookmarkPopoverOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              onClick={() => setBookmarkPopoverOpen(true)}
              className={cn(
                "absolute card z-10 flex h-10 w-10 bg-white cursor-pointer  rounded-full justify-center items-center top-6 right-6",
                className
              )}
            >
              <HiOutlineBookmark
                size={24}
                className={cn("hover:stroke-primary-default", iconClassName)}
              />
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Bookmarks</TooltipContent>
      </Tooltip>

      <PopoverContent className="min-h-[300px]">
        <h5 className="text-lg font-semibold mb-2">Bookmarks</h5>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : data?.subProjectBookmarks?.length ? (
          <ScrollArea className="max-w-[500px] h-[350px] ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-3">
              {data?.subProjectBookmarks?.map((bookmark) => (
                <BookmarkCard
                  key={`bookmark-${bookmark.id}-${bookmark.imageId}`}
                  bookmark={bookmark}
                  closePopover={() => setBookmarkPopoverOpen(false)}
                  removeNodeBookmark={removeNodeBookmark}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p>No Bookmarks!</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default BookmarkPopover;
