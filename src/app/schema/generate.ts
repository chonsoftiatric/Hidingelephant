import { z } from "zod";

export const generateSchema = z.object({
  // projectId: z.string(),
  prompt: z.string(),
  negativePrompt: z.string(),
  elephantBrain: z.string().min(1, "Please select the elephant brain"),
  elephantModel: z.string().min(1, "Please select the elephant model"),
  quality: z.number().min(10).max(50).default(10),
  numberOfImages: z.number().min(3).max(12).default(3),
  cfg: z.number().min(0).max(30).default(0),
  seed: z.number().min(-1).max(1000000).default(-1),
  height: z.number().min(128).max(1024).default(512).optional(),
  width: z.number().min(128).max(1024).default(512).optional(),
  xAxis: z.string().optional(),
  yAxis: z.string().optional(),
  zAxis: z.string().optional(),
});

export type Generate = z.infer<typeof generateSchema>;
