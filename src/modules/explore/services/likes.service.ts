import { toggleFeedImageLike } from "@/actions/explore/like";

// POST LIKE TO FEED [MUTATION]
export const toggleFeedImageLikeRequest = async (id: string) => {
  return await toggleFeedImageLike({ id });
};
