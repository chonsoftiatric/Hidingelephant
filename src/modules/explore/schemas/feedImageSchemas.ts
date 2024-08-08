import * as z from "zod";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

export const feedImageFormSchema = z.object({
  title: z.string().min(3).max(500),
  description: z.string(),
  tags: z.array(optionSchema).optional(),
});

export const feedImagePostReqSchema = z.object({
  imageId: z.number(),
  title: z.string().min(3).max(500),
  description: z.string().optional(),
  tags: z.number().array().optional(),
});
export type IFeedImagePostReq = z.infer<typeof feedImagePostReqSchema>;
