import { Img2ImgGenerate } from "@/app/schema/img2img.schema";
import { IPromptSettingStore } from "@/types/prompt-settings";
import { DALL_E_MODEL } from "@/utils/CONSTANTS";
import { getValueWithOneSpace } from "@/utils/fn.frontend";
import { IDBUser } from "@/types/db.schema.types";

type IGetImg2ImgPayload = {
  promptState: IPromptSettingStore;
  imgUrl: string;
  maskBase64?: string;
  sketchBase64?: string;
  withPrompt?: boolean;
};
export const getImg2ImgPayload = ({
  promptState,
  imgUrl,
  maskBase64,
  sketchBase64,
  withPrompt = true,
}: IGetImg2ImgPayload): Img2ImgGenerate => {
  const payload = {
    prompt: withPrompt
      ? promptState.prompt
        ? getValueWithOneSpace(promptState.prompt)
        : ""
      : "",
    negativePrompt: promptState.negativePrompt,
    seed: promptState.seed,
    cfg: promptState.cfg,
    // elephantBrain: promptState.elephantBrain,
    // @temp - if its mask generation use dall-e else use the selected model
    elephantBrain: maskBase64 ? DALL_E_MODEL : promptState.elephantBrain,
    elephantModel: promptState.elephantModel,
    numberOfImages: promptState.numberOfImages,
    quality: promptState.quality,
    initImage: imgUrl,
    maskImage: maskBase64,
    sketchBase64,
  };
  return payload;
};

export const roleAccess = (
  roles: IDBUser["role"][],
  role: IDBUser["role"] | null | undefined
) => {
  if (!role) return false;
  return roles.includes(role);
};
