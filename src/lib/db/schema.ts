import {
  mysqlTable,
  serial,
  text,
  bigint,
  smallint,
  varchar,
  timestamp,
  int,
  boolean,
  mysqlEnum,
  json,
  float,
  unique,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { IMagicScriptArgs } from "@/modules/project/types/common.types";
import { NodeSchemaType } from "@/modules/canvas/types/canvas.types";
import { ReportItem } from "@/schemas/report.schema";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey().notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").default("").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  profileImage: varchar("profileImage", { length: 255 }),
  coverImage: varchar("coverImage", { length: 255 }),

  // Stripe Fields
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  stripeCurrentPeriodEnd: timestamp("stripeCurrentPeriodEnd", { mode: "date" }),
  plan: mysqlEnum("plan", ["FREE", "PLUS", "PRO", "EARLY_BIRD"])
    .notNull()
    .default("FREE"),

  role: mysqlEnum("role", ["USER", "BETA_TESTER", "MODERATOR", "ADMIN"])
    .notNull()
    .default("USER"),

  // Referral Fields
  referralCode: varchar("referralCode", { length: 255 }),
  invitedById: bigint("invitedById", { mode: "number" }),
  username: text("username"),

  facebookUrl: varchar("facebookUrl", { length: 255 }).default("").notNull(),
  twitterUrl: varchar("twitterUrl", { length: 255 }).default("").notNull(),
  linkedinUrl: varchar("linkedinUrl", { length: 255 }).default("").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .onUpdateNow()
    .notNull(),
});

// user relations
export const userInvitedByRelation = relations(users, ({ one }) => ({
  invitedBy: one(users, {
    fields: [users.invitedById],
    references: [users.id],
  }),
}));

export const projects = mysqlTable("projects", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description").default("").notNull(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  type: mysqlEnum("type", ["PLAYGROUND", "DEFAULT"])
    .default("DEFAULT")
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
});
export const userToProjectsRelation = relations(users, ({ many }) => ({
  projects: many(projects),
}));
export const projectRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

// sub projects
export const subProjects = mysqlTable("subProjects", {
  id: serial("id").primaryKey().notNull(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  name: text("name").notNull(),
  description: text("description").default("").notNull(),
  projectId: bigint("projectId", { mode: "number" }).notNull(),
  visibility: mysqlEnum("visibility", ["PUBLIC", "PRIVATE"])
    .default("PUBLIC")
    .notNull(),
  type: mysqlEnum("type", ["PLAYGROUND", "DEFAULT"])
    .default("DEFAULT")
    .notNull(),
  isShared: boolean("isShared").default(false).notNull(),
  shareHash: text("shareHash"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
});
export const projectToSubProjectsRelation = relations(projects, ({ many }) => ({
  subProjects: many(subProjects),
}));
export const subProjectRelations = relations(subProjects, ({ one }) => ({
  project: one(projects, {
    fields: [subProjects.projectId],
    references: [projects.id],
  }),
}));

export const prompts = mysqlTable("prompts", {
  id: serial("id").primaryKey().notNull(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  apiName: text("api_name").notNull(),
  prompt: text("prompt").notNull(),
  defaultPrompt: text("default_prompt").default("").notNull(),
  negativePrompt: text("negative_prompt").notNull(),
  defaultNegativePrompt: text("default_negative_prompt").default("").notNull(),
  original_seed: bigint("seed", { mode: "number" }).notNull(),
  samplerIndex: text("sampler_index").notNull(),
  steps: bigint("steps", { mode: "number" }).notNull(),
  cfgScale: bigint("cfg_scale", { mode: "number" }).notNull(),
  batchSize: smallint("batch_size").notNull().default(1),
  height: smallint("height").notNull().default(512),
  width: smallint("width").notNull().default(512),
  subProjectId: bigint("subProjectId", { mode: "number" }).notNull(),
  s3ImageBucketKey: text("s3_image_key"),

  parentImageId: bigint("imageId", { mode: "number" }),
  sketchImageUrl: varchar("sketch_image_url", { length: 255 }),

  type: mysqlEnum("type", ["DEFAULT", "MAGIC", "IMG2IMG"])
    .default("DEFAULT")
    .notNull(),
  script_args: json("script_args").$type<IMagicScriptArgs>().default(null),
  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow(),
});

// subProjects to prompt relation
export const projectToPromptRelation = relations(subProjects, ({ many }) => ({
  prompts: many(prompts),
}));
export const promptRelations = relations(prompts, ({ one }) => ({
  subProject: one(subProjects, {
    fields: [prompts.subProjectId],
    references: [subProjects.id],
  }),
}));
// prompt to parentImage relation (ont-to-one) for generate similar images prompt
export const promptToParentImageRelation = relations(prompts, ({ one }) => ({
  parentImage: one(images, {
    fields: [prompts.parentImageId],
    references: [images.id],
  }),
}));

// images
export const images = mysqlTable("images", {
  id: serial("id").primaryKey().notNull(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  promptId: bigint("promptId", { mode: "number" }).notNull(),

  imageUrl: text("s3_image_key").notNull(),
  blurHash: text("blurHash").notNull().default(""),
  likes: int("likes").notNull().default(0).notNull(),
  isActive: boolean("isActive").default(false).notNull(),
  isPrivate: boolean("isPrivate").default(true).notNull(),
  generated_seed: bigint("generated_seed", { mode: "number" })
    .default(-1)
    .notNull(),
  generated_prompt: text("generated_prompt").notNull(),
  type: mysqlEnum("type", ["logo", "business_card"]).default("logo").notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
});
// prompt to images relation
export const promptToImagesRelation = relations(prompts, ({ many }) => ({
  images: many(images),
}));
export const userToImagesRelation = relations(users, ({ many }) => ({
  images: many(images),
}));
export const imageRelations = relations(images, ({ one }) => ({
  prompt: one(prompts, {
    fields: [images.promptId],
    references: [prompts.id],
  }),
  user: one(users, {
    fields: [images.userId],
    references: [users.id],
  }),
}));

// Canvas
export const canvas = mysqlTable("canvas", {
  id: serial("id").primaryKey().notNull(),
  subProjectId: bigint("subProjectId", { mode: "number" }).notNull(),
  nodeSchema: json("nodeSchema")
    .$type<NodeSchemaType>()
    .default({
      nodes: [
        {
          id: "dummy-001",
          position: {
            x: 0,
            y: 0,
          },
          data: "",
          type: "dummyNode",
        },
      ],
      edges: [],
    })
    .notNull(),
});
export const canvasProjectRelation = relations(canvas, ({ one }) => ({
  subProject: one(subProjects, {
    fields: [canvas.subProjectId],
    references: [subProjects.id],
  }),
}));
export const subProjectCanvasRelation = relations(subProjects, ({ one }) => ({
  canvas: one(canvas),
}));

// Credit Tables
export const credit = mysqlTable("credit", {
  id: serial("id").primaryKey().notNull(),
  userId: bigint("userId", { mode: "number" }).notNull().unique(),
  credits: float("credits").default(0).notNull(),
  earnedCredits: float("earnedCredits").default(0).notNull(),
  remainingCredits: float("remainingCredits").default(0).notNull(),
  purchasedCredits: float("purchasedCredits").default(0).notNull(),
  monthlyCredit: float("monthlyCredit").default(0).notNull(),
  creditsAllocated: boolean("creditsAllocated").default(false).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).onUpdateNow(),
});
// one-to-one relation - creditConfig - user
export const creditUserRelation = relations(credit, ({ one }) => ({
  user: one(users, {
    fields: [credit.userId],
    references: [users.id],
  }),
}));
export const userCreditRelation = relations(users, ({ one }) => ({
  credit: one(credit),
}));

export const creditHistory = mysqlTable("creditHistory", {
  id: serial("id").primaryKey().notNull(),
  creditId: bigint("creditId", { mode: "number" }).notNull(),
  credits: float("credits").default(0).notNull(),
  creditsUsed: float("creditsUsed").default(0).notNull(),
  plan: mysqlEnum("plan", ["FREE", "PLUS", "PRO", "EARLY_BIRD"])
    .notNull()
    .default("FREE"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});
// one-to-many relation - creditHistory - credit
export const creditInfoToCreditHistoryRelation = relations(
  creditHistory,
  ({ one }) => ({
    credit: one(credit, {
      fields: [creditHistory.creditId],
      references: [credit.id],
    }),
  })
);
export const creditHistoryToCreditInfoRelation = relations(
  credit,
  ({ many }) => ({
    creditHistory: many(creditHistory),
  })
);

export const creditsUsed = mysqlTable("credits_used", {
  id: int("id").primaryKey().autoincrement(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  creditsUsed: float("creditsUsed").default(0).notNull(),
  creditValue: float("creditValue").default(0).notNull(),
  elephantBrain: text("elephantBrain"),
  elephantStyle: text("elephantStyle"),
  generationType: mysqlEnum("generationType", [
    "DEFAULT",
    "MAGIC",
    "SKETCH",
    "SIMILAR",
  ])
    .default("DEFAULT")
    .notNull(),
  timeTaken: float("timeTaken").default(0).notNull(),
  numberOfImages: int("numberOfImages").default(0).notNull(),
  plan: mysqlEnum("plan", ["FREE", "PLUS", "PRO", "EARLY_BIRD"])
    .notNull()
    .default("FREE"),
  feature: text("feature"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

//vectorize image table
export const vectorize_images = mysqlTable("vectorize_images", {
  id: serial("id").primaryKey(),
  imageId: bigint("imageId", { mode: "number" }).notNull(),
  subProjectId: bigint("subProjectId", { mode: "number" }).default(54),
  userId: bigint("userId", { mode: "number" }).notNull(),
  image_url: text("imageUrl").notNull(),
  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow(),
});

export const imageToVectorizeRelation = relations(images, ({ many }) => ({
  vectorize_images: many(vectorize_images),
}));
export const subProjectToVectorizeRelation = relations(
  subProjects,
  ({ many }) => ({
    vectorize_images: many(vectorize_images),
  })
);

export const imageToParenRelation = relations(vectorize_images, ({ one }) => ({
  image: one(images, {
    fields: [vectorize_images.imageId],
    references: [images.id],
  }),
}));
export const vectorToSubProjectRelation = relations(
  vectorize_images,
  ({ one }) => ({
    subProject: one(subProjects, {
      fields: [vectorize_images.imageId],
      references: [subProjects.id],
    }),
  })
);

// user onBoarding data
export const onBoarding = mysqlTable("onBoarding", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number" }).unique().notNull(),
  sourceReference: text("sourceReference").notNull(),
  teamSize: text("teamSize").notNull(),
  workRole: json("workRole").$type<string[]>(),
  primaryUsage: json("primaryUsage").$type<string[]>(),
  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow(),
});

export const userToOnBoardingRelation = relations(onBoarding, ({ one }) => ({
  user: one(users, {
    fields: [onBoarding.userId],
    references: [users.id],
  }),
}));

export const feedImages = mysqlTable("feedImages", {
  id: serial("id").primaryKey().notNull(),
  imageId: bigint("imageId", { mode: "number" }).notNull().unique(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
});

export const feedImageRelations = relations(feedImages, ({ one }) => ({
  image: one(images, {
    fields: [feedImages.imageId],
    references: [images.id],
  }),
  user: one(users, {
    fields: [feedImages.userId],
    references: [users.id],
  }),
}));

export const userToFeedImageRelation = relations(users, ({ many }) => ({
  feedImages: many(feedImages),
}));

export const imageToFeedImageRelation = relations(images, ({ one }) => ({
  feedImage: one(feedImages),
}));

export const likes = mysqlTable(
  "likes",
  {
    id: serial("id").primaryKey().notNull(),
    userId: bigint("userId", { mode: "number" }).notNull(),
    feedImageId: bigint("feedImageId", { mode: "number" }).notNull(),
  },
  (t) => ({
    userImageUnique: unique().on(t.userId, t.feedImageId),
  })
);

export const likeRelations = relations(likes, ({ one }) => ({
  feedImage: one(feedImages, {
    fields: [likes.feedImageId],
    references: [feedImages.id],
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));

export const userToLikesRelation = relations(users, ({ many }) => ({
  likes: many(likes),
}));

export const feedImageToLikesRelation = relations(feedImages, ({ many }) => ({
  likes: many(likes),
}));

export const comments = mysqlTable("comments", {
  id: serial("id").primaryKey().notNull(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  feedImageId: bigint("feedImageId", {
    mode: "number",
  }).notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
});

export const commentRelations = relations(comments, ({ one }) => ({
  feedImage: one(feedImages, {
    fields: [comments.feedImageId],
    references: [feedImages.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const userToCommentsRelation = relations(users, ({ many }) => ({
  comments: many(comments),
}));

export const feedImageToCommentsRelation = relations(
  feedImages,
  ({ many }) => ({
    comments: many(comments),
  })
);

export const tags = mysqlTable("tags", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull().unique(),
});

export const feedImagesTags = mysqlTable("feedImagesTags", {
  id: serial("id").primaryKey().notNull(),
  feedImageId: bigint("feed_image_id", { mode: "number" }).notNull(),
  tagId: bigint("tag_id", { mode: "number" }).notNull(),
});

// =========== sub project bookmarks ============== //
export const subProjectBookmarks = mysqlTable("subProjectBookmarks", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  subProjectId: bigint("subProjectId", { mode: "number" }).notNull(),
  promptId: bigint("promptId", { mode: "number" }).notNull(),
  imageId: bigint("imageId", { mode: "number" }).notNull().unique(),
});

// sub project bookmarks relations //
export const subProjectBookamrkRelation = relations(
  subProjectBookmarks,
  ({ one }) => ({
    subProject: one(subProjects, {
      fields: [subProjectBookmarks.subProjectId],
      references: [subProjects.id],
    }),
    user: one(users, {
      fields: [subProjectBookmarks.userId],
      references: [users.id],
    }),
    image: one(images, {
      fields: [subProjectBookmarks.imageId],
      references: [images.id],
    }),
  })
);
export const userToSubProjectBookamrksRelation = relations(
  users,
  ({ many }) => ({
    subProjectBookmarks: many(subProjectBookmarks),
  })
);
export const subProjectToSubProjectBookamrksRelation = relations(
  subProjects,
  ({ many }) => ({
    subProjectBookmarks: many(subProjectBookmarks),
  })
);
export const imageToSubProjectBookamrkRelation = relations(
  images,
  ({ one }) => ({
    subProjectBookmark: one(subProjectBookmarks),
  })
);
// =========== sub project bookmarks end ============== //

// ======= REPORTS ======== //
export const reports = mysqlTable("reports", {
  id: int("id").primaryKey().autoincrement(),
  report: json("report").$type<ReportItem>().notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .defaultNow()
    .onUpdateNow()
    .notNull(),
});
