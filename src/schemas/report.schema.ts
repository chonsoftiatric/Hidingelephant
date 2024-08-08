import { z } from "zod";

export const reportSchema = z.object({
  user: z.object({
    FREE: z.object({
      total: z.number().optional().default(0),
      creditsUsed: z.number().optional().default(0),
    }),
    PRO: z.object({
      total: z.number().optional().default(0),
      creditsUsed: z.number().optional().default(0),
    }),
    PLUS: z.object({
      total: z.number().optional().default(0),
      creditsUsed: z.number().optional().default(0),
    }),
    EARLY_BIRD: z.object({
      total: z.number().optional().default(0),
      creditsUsed: z.number().optional().default(0),
    }),
  }),
  generationFeature: z.object({
    SIMILAR: z.object({
      count: z.number().optional().default(0),
      creditsUsed: z.number().optional().default(0),
    }),
    SKETCH: z.object({
      count: z.number().optional().default(0),
      creditsUsed: z.number().optional().default(0),
    }),
    DEFAULT: z.object({
      count: z.number().optional().default(0),
      creditsUsed: z.number().optional().default(0),
    }),
    MAGIC: z.object({
      count: z.number().optional().default(0),
      creditsUsed: z.number().optional().default(0),
    }),
  }),
  modelSelector: z.object({
    DY: z.object({
      count: z.number().optional().default(0),
      creditsUsed: z.number().optional().default(0),
    }),
    "DALL-E": z.object({
      count: z.number().optional().default(0),
      creditsUsed: z.number().optional().default(0),
    }),
    GV: z.object({
      count: z.number().optional().default(0),
      creditsUsed: z.number().optional().default(0),
    }),
  }),
  styleSelector: z.object({
    standardElephant: z.object({
      count: z.number().optional().default(0),
      creditsUsed: z.number().optional().default(0),
    }),
    creativeElephant: z.object({
      count: z.number().optional().default(0),
      creditsUsed: z.number().optional().default(0),
    }),
    crazyElephant: z.object({
      count: z.number().optional().default(0),
      creditsUsed: z.number().optional().default(0),
    }),
    wildElephant: z.object({
      count: z.number().optional().default(0),
      creditsUsed: z.number().optional().default(0),
    }),
  }),
  features: z.object({
    VECTORIZE: z.object({
      count: z.number().optional().default(0),
      creditsUsed: z.number().optional().default(0),
    }),
  }),
  totalCreditsUsed: z.number().optional().default(0),
});

export type ReportItem = z.infer<typeof reportSchema>;

export const reportInitialItem: ReportItem = {
  user: {
    FREE: {
      total: 0,
      creditsUsed: 0,
    },
    PRO: {
      total: 0,
      creditsUsed: 0,
    },
    PLUS: {
      total: 0,
      creditsUsed: 0,
    },
    EARLY_BIRD: {
      total: 0,
      creditsUsed: 0,
    },
  },
  generationFeature: {
    SIMILAR: {
      count: 0,
      creditsUsed: 0,
    },
    SKETCH: {
      count: 0,
      creditsUsed: 0,
    },
    DEFAULT: {
      count: 0,
      creditsUsed: 0,
    },
    MAGIC: {
      count: 0,
      creditsUsed: 0,
    },
  },
  modelSelector: {
    DY: {
      count: 0,
      creditsUsed: 0,
    },
    "DALL-E": {
      count: 0,
      creditsUsed: 0,
    },
    GV: {
      count: 0,
      creditsUsed: 0,
    },
  },
  styleSelector: {
    standardElephant: {
      count: 0,
      creditsUsed: 0,
    },
    creativeElephant: {
      count: 0,
      creditsUsed: 0,
    },
    crazyElephant: {
      count: 0,
      creditsUsed: 0,
    },
    wildElephant: {
      count: 0,
      creditsUsed: 0,
    },
  },
  features: {
    VECTORIZE: {
      count: 0,
      creditsUsed: 0,
    },
  },
  totalCreditsUsed: 0,
};
