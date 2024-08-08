import {
  subProjectBookmarks,
  subProjects,
  images,
  vectorize_images,
  prompts,
  creditHistory,
  credit,
  projects,
  users,
  feedImages,
  creditsUsed,
} from "@/lib/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const usersSchema = createSelectSchema(users);
export type IDBUser = z.infer<typeof usersSchema>;
export type SelectUser = InferSelectModel<typeof users>;

export const subProjectBookmarksSchema =
  createSelectSchema(subProjectBookmarks);
export type ISubProjectBookmark = z.infer<typeof subProjectBookmarksSchema>;

export const subProjectsSchema = createSelectSchema(subProjects);
export type ISubProject = z.infer<typeof subProjectsSchema>;
export type SelectSubProject = InferSelectModel<typeof subProjects>;

export const imageSelectSchema = createSelectSchema(images);
export type Image = z.infer<typeof imageSelectSchema>;

export const vectorizeImageSchema = createSelectSchema(vectorize_images);
export type IVectorizedImage = z.infer<typeof vectorizeImageSchema>;

export const promptsSelectSchema = createSelectSchema(prompts);
export type IPrompt = z.infer<typeof promptsSelectSchema>;

export const creditSchema = createSelectSchema(credit);
export type ICredit = z.infer<typeof creditSchema>;

export const creditHistorySchema = createSelectSchema(creditHistory);
export type ICreditHistory = z.infer<typeof creditHistorySchema>;

export const creditsUsedSchema = createSelectSchema(creditsUsed);
export type ICreditUsed = z.infer<typeof creditsUsedSchema>;

export const projectSelectSchema = createSelectSchema(projects);
export type IProject = z.infer<typeof projectSelectSchema>;

export const feedImagesSchema = createSelectSchema(feedImages);
export type IFeedImage = z.infer<typeof feedImagesSchema>;
