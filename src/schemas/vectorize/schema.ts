import { z } from "zod";

const vectorizeOptionsSchema = z.object({
  colormode: z.enum(["color", "binary"]).default("color"),
  hierarchical: z.enum(["stacked", "cutout"]).default("stacked"),
  mode: z.enum(["spline", "polygon", "none"]).default("spline"),
  filter_speckle: z.number().default(4),
  color_precision: z.number().default(6),
  layer_difference: z.number().default(16),
  corner_threshold: z.number().default(60),
  length_threshold: z.number().default(4.0),
  max_iterations: z.number().default(10),
  splice_threshold: z.number().default(45),
  path_precision: z.number().default(3),
});

export type IVectorizeOptions = z.infer<typeof vectorizeOptionsSchema>;
