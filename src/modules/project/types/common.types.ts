import {
  IFeedImage,
  IPrompt,
  ISubProjectBookmark,
  Image,
} from "@/types/db.schema.types";

export type ISubProjectBookmarkWithImage = ISubProjectBookmark & {
  image: Image;
};

export type IProjectImage = Image & {
  subProjectBookmark: ISubProjectBookmark | null;
  feedImage: IFeedImage | null;
};
export type IProjectPrompt = IPrompt & {
  images: IProjectImage[];
  parentImage: IProjectImage | null | undefined;
};

export type IMagicScriptArgs =
  | [
      number,
      string, // x axix values
      [],
      number,
      string, // y axis values
      [],
      number,
      string, // z axis values
      [],
      boolean, // drawLegend
      "True" | "False", // includeLoneImages
      "True" | "False", // includeSubGrids
      "True" | "False", // noFixedSeeds
      number, // marginSize
      "True" | "False" // csvMode
    ]
  | null;

export type IMenuLinks = {
  name: string;
  link: string;
  icon: React.ReactNode;
};
