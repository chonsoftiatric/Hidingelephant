import * as z from "zod";
import { feedImagePostReqSchema } from "../schemas/feedImageSchemas";
import { IGetFeedParams } from "../types/feed.types";
import {
  getFeedData,
  getFeedImageData,
  shareImageToFeed,
} from "@/actions/feed/feed";

// POST IMAGE TO FEED [MUTATION]
export const shareImageToFeedService = async (
  payload: z.infer<typeof feedImagePostReqSchema>
) => {
  return await shareImageToFeed({ body: payload });
};

// GET FEED [QUERY]
export const getFeed = async ({
  offset,
  tag,
  sortBy,
  username,
}: IGetFeedParams) => {
  return await getFeedData({ offset, tag, sortBy, username });
};

// GET FEED IMAGE [QUERY]
export const getFeedImage = async ({ id }: { id: string }) => {
  return await getFeedImageData({ id });
};
