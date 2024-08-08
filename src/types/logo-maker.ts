import { IPrompt, Image } from "@/types/db.schema.types";

type IActiveItem = { image: Image; prompt: IPrompt } | undefined;
export type ILogoMakerStore = {
  activeItem: IActiveItem;
  setActiveItem: (val: IActiveItem) => void;
};
