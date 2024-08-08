import { z } from "zod";

export const creditFeatureSchema = z.enum(["VECTORIZE"]);
export type CreditFeature = z.infer<typeof creditFeatureSchema>;
