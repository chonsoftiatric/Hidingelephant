import { IPromptSettingStore } from "@/types/prompt-settings";
import { create } from "zustand";

const defaultSettings = {
  prompt: "",
  negativePrompt: "",
  quality: 30,
  cfg: 7,
  elephantBrain: "",
  elephantModel: "",
  numberOfImages: 3,
  seed: -1,
};

export const usePromptStore = create<IPromptSettingStore>((set) => ({
  ...defaultSettings,
  keywords: [],
  keywordsArr: [],
  isLoading: false,
  changeModelMessageShow: false,
  setChangeModelMessageShow: (val) => set({ changeModelMessageShow: val }),
  setIsLoading: (val) => set({ isLoading: val }),
  setKeywords: (val) => set({ keywords: val }),
  setKeywordsArr: (val) => set({ keywordsArr: val }),
  setPrompt: (val) => set({ prompt: val }),
  setCFG: (val) => set({ cfg: val }),
  setElephantBrain: (val) => set({ elephantBrain: val }),
  setElephantStyle: (val) => set({ elephantModel: val }),
  setNegativePrompt: (val) => set({ negativePrompt: val }),
  setQuality: (val) => set({ quality: val }),
  setSeed: (val) => set({ seed: val }),
  setNumberOfImages: (val) => set({ numberOfImages: val }),
}));
