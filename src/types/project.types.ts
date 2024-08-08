import { z } from "zod";
import { projects } from "@/lib/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { Image, IPrompt, ISubProject } from "@/types/db.schema.types";

export const projectSelectSchema = createSelectSchema(projects);
export type IProject = z.infer<typeof projectSelectSchema>;
export type ICurrentUserProjectsList = {
  id: number;
  name: string;
  type: IProject["type"];
  subProjects: ISubProject[];
};

export type IPromptData = IPrompt & {
  images: Image[];
};

export type IProjectCreatePayload = {
  name: string;
  description: string;
  isPrivate: boolean;
};

export type IProjectUpdatePayload = {
  name: string;
  description?: string;
};
export type IProjectUpdateParams = {
  id: string;
  payload: IProjectUpdatePayload;
};

export type IDallEResponseData = {
  created: number;
  data: {
    revised_prompt?: string;
    url: string;
  }[];
};
