import * as z from "zod";

export const tagPostRequestSchema = z.object({
  tag: z.string().min(2).max(25),
});
export type CreateTagPayloadBody = z.infer<typeof tagPostRequestSchema>;
