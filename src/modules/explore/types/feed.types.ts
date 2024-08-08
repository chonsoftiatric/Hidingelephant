import { IPrompt } from "@/types/db.schema.types";

export type IGetFeedParams = {
  offset: number;
  tag?: string;
  sortBy?: string;
  username?: string;
};

export type IGetFeedHookParams = {
  tag?: string;
  sortBy?: string;
  username?: string;
};

export type IFeed = {
  feedImageId: number;
  title: string;
  description: string;
  imageURL: string;
  postedAt: string | Date;
  username: string | null;
  userImage: string | null;
  likes: number;
  isLiked: number;
  prompt: IPrompt;
};

export type IFeedResponse = {
  feed: IFeed[];
  offset: number;
};
