import { Generate } from "@/app/schema/generate";
type IMagicKeyword = { keyword: string; value: string };

export type IPromptSettingStore = Generate & {
  keywords: IMagicKeyword[];
  keywordsArr: IMagicKeyword[];
  isLoading: boolean;
  changeModelMessageShow: boolean;
  setChangeModelMessageShow: (val: boolean) => void;
  setIsLoading: (val: boolean) => void;
  setKeywordsArr: (val: IMagicKeyword[]) => void;
  setKeywords: (val: IMagicKeyword[]) => void;
  setPrompt: (value: string) => void;
  setNegativePrompt: (value: string) => void;
  setCFG: (value: number) => void;
  setQuality: (value: number) => void;
  setElephantBrain: (value: string) => void;
  setElephantStyle: (value: string) => void;
  setSeed: (value: number) => void;
  setNumberOfImages: (value: number) => void;
};
