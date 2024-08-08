import { z } from "zod";

export const projectSchema = z.object({
  name: z.string(),
  type: z.enum(["PLAYGROUND", "DEFAULT"]).optional(),
  description: z.string().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PRIVATE"),
});

export type Project = z.infer<typeof projectSchema>;
