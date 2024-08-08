import { queryClient } from "@/providers/TanstackProvider";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { ISubProjectByIdResponseModel } from "../types/api.response.types";
import { IProjectPrompt } from "../types/common.types";

export const logoGenerationSuccess = (
  key: string[],
  prompt: IProjectPrompt
) => {
  queryClient.invalidateQueries({
    queryKey: [API_ROUTES.PROMPTS.GET_RECENT_PROMPTS],
  });
  queryClient.invalidateQueries({ queryKey: [API_ROUTES.USER.GET_STATS] });
  // replace the skelton item (last item) with received prompt
  queryClient.setQueryData<ISubProjectByIdResponseModel>(key, (data) => {
    if (data) {
      const newData = { ...data };
      newData.prompts = [...data.prompts];
      newData.prompts[data.prompts.length - 1] = prompt;
      return newData;
    }
    return data;
  });
};

export const logoGenerationError = (key: string[]) => {
  // remove the skelton item (last item)
  queryClient.setQueryData<ISubProjectByIdResponseModel>(key, (data) => {
    if (data) {
      const newData = { ...data };
      newData.prompts = [...data.prompts];
      newData.prompts.pop();
      return newData;
    }
    return data;
  });
};

export const logoGenerationMutate = (key: string[], numberOfImage: number) => {
  queryClient.setQueryData<ISubProjectByIdResponseModel>(key, (data) => {
    if (data?.prompts) {
      const newData = { ...data };
      newData.prompts = [...data.prompts];
      newData.prompts.push({
        // @ts-ignore
        isSkeleton: true,
        imageCount: numberOfImage,
      });
      return newData;
    }
    return data;
  });
};
