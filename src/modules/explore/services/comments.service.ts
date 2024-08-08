import { IGetCommentsOnFeedReq } from "../types/comment.types";
import { commentPostSchema } from "../schemas/commentSchema";
import * as z from "zod";
import {
  addComment,
  getFeedImageCommentsById,
} from "@/actions/explore/comment";

// POST COMMENT TO FEED IMAGE [MUTATION]
export const postComment = async ({
  id,
  payload,
}: {
  id: string;
  payload: z.infer<typeof commentPostSchema>;
}) => {
  return await addComment({ id, payload });
};

// GET COMMENTS ON A FEED [QUERY]
export const getComments = async ({ id, offset }: IGetCommentsOnFeedReq) => {
  return await getFeedImageCommentsById({ id, offset });
};
