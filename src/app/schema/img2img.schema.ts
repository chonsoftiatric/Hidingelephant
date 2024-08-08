import { z } from "zod";
import { zfd } from "zod-form-data";

export const img2imgSchema = z.object({
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
  initImage: z.string(),
  maskImage: z.string().optional(),
  sketchBase64: z.string().optional(),
});
export const img2imgFormDataSchema = zfd.formData({
  prompt: zfd.text(z.string().optional().default("")),
  negativePrompt: zfd.text(z.string().optional().default("")),
  elephantBrain: zfd.text(),
  elephantModel: zfd.text(),
  quality: zfd.numeric(z.number().min(10).max(50).default(10)),
  numberOfImages: zfd.numeric(z.number().min(3).max(12).default(3)),
  cfg: zfd.numeric(z.number().min(0).max(30).default(0)),
  seed: zfd.numeric(z.number().min(-1).max(1000000).default(-1)),
  height: zfd.numeric(z.number().optional().default(512)),
  width: zfd.numeric(z.number().optional().default(512)),
  initImage: zfd.text(),
  maskImage: zfd.text(z.string().optional().default("")),
});

export type Img2ImgGenerate = z.infer<typeof img2imgSchema>;
