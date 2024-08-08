import { commentPostSchema } from "@/modules/explore/schemas/commentSchema";
import { z } from "zod";

export type IComment = {
  commentId: number;
  comment: string;
  postedAt: Date;
  username: string | null;
  avatar: string | undefined;
};

export type ICommentResponse = {
  offset: number;
  comments: IComment[];
};

export type IGetCommentsOnFeedReq = {
  id: string;
  offset: number;
};

export type ICommentPost = z.infer<typeof commentPostSchema>;
