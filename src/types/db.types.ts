import {
  IFeedImage,
  Image,
  IPrompt,
  ISubProjectBookmark,
} from "@/types/db.schema.types";

export type PromptWithMetadata = IPrompt & {
  images: ImageWithBookmarkAndFeed[];
  parentImage: ImageWithBookmarkAndFeed | null;
};

export type ImageWithBookmarkAndFeed = Image & {
  subProjectBookmark: ISubProjectBookmark | null;
  feedImage: IFeedImage | null;
};
