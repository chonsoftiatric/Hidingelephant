import * as z from "zod";

export const commentPostSchema = z.object({
  comment: z.string(),
});
