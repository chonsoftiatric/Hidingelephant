import {
  IPrompt,
  ISubProject,
  Image,
  IProject,
  IFeedImage,
} from "@/types/db.schema.types";
import { IProjectPrompt, ISubProjectBookmarkWithImage } from "./common.types";

export type ISubProjectByIdResponseModel = ISubProject & {
  prompts: IProjectPrompt[];
  canvasId: number;
};

export interface IRecentPrompts extends ISubProject {
  prompts: Array<IPrompt & { images: Image[] }>;
  project: IProject;
}

export type IPromptWithImagesResponse = IPrompt & { images: Image[] };
export type ISubProjectBookmarks = ISubProject & {
  subProjectBookmarks: ISubProjectBookmarkWithImage[];
  feedImage: IFeedImage;
};
