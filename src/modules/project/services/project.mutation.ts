import { Generate } from "@/app/schema/generate";
import { Img2ImgGenerate } from "@/app/schema/img2img.schema";
import { queryClient } from "@/providers/TanstackProvider";
import { usePromptStore } from "@/store/prompt-settings";
import { urlToBase64 } from "@/utils";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { useMutation } from "@tanstack/react-query";

import {
  ISubProjectBookmarks,
  ISubProjectByIdResponseModel,
} from "@/modules/project/types/api.response.types";
import { IProjectPrompt } from "@/modules/project/types/common.types";
import {
  logoGenerationError,
  logoGenerationMutate,
  logoGenerationSuccess,
} from "@/modules/project/utils/service.utils";
import { generateImage2ImageAction } from "@/actions/generations/generateImage2ImageAction";
import { runpodGeneration } from "@/actions/generations/runpodGenertion";
import { googleVertexGeneration } from "@/actions/generations/googleVertexGeneration";
import { dallEGeneration } from "@/actions/generations/dallEGeneration";
import { toggleImageBookmark } from "@/actions/sub-project-bookmark/toggleImageBookmark";
import { ICurrentUserProjectsList } from "@/types/project.types";

// generate logo mutation request
export const generateLogoRequest = async ({
  payload,
  id,
}: {
  id: string;
  payload: Generate;
}) => {
  return await runpodGeneration({ id, body: payload });
};

// vertex logo generation request
export const vertexGenerateLogoRequest = async ({
  payload,
  id,
}: {
  id: string;
  payload: Generate;
}) => {
  return await googleVertexGeneration({ id, body: payload });
};
export const dallEGenerateLogoRequest = async ({
  payload,
  id,
}: {
  id: string;
  payload: Generate;
}) => {
  return await dallEGeneration({ id, body: payload });
};

/**
 *
 * @param subProjectId sub project id
 * @param successCB a callback function that will be called on success to handle additional actions ex: close modal
 * @returns
 */
export const useProjectGenerationMutation = (subProjectId: string) => {
  const { setIsLoading } = usePromptStore();
  const key = [
    API_ROUTES.SUB_PROJECTS.GET_SUB_PROJECT_PROMPTS_BY_ID(subProjectId),
  ];
  return useMutation({
    mutationFn: generateLogoRequest,
    onSuccess: async (prompt) => {
      logoGenerationSuccess(key, prompt);
      // invalidate the credits query
      const creditKey = API_ROUTES.USER.GET_CREDIT;
      queryClient.invalidateQueries({
        queryKey: [creditKey],
      });
    },
    onError: () => {
      logoGenerationError(key);
    },
    onMutate: ({ payload }) => {
      logoGenerationMutate(key, payload.numberOfImages);
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
};
export const useVertexProjectGenerationMutation = (subProjectId: string) => {
  const { setIsLoading } = usePromptStore();
  const key = [
    API_ROUTES.SUB_PROJECTS.GET_SUB_PROJECT_PROMPTS_BY_ID(subProjectId),
  ];
  return useMutation({
    mutationFn: vertexGenerateLogoRequest,
    onSuccess: async (prompt) => {
      logoGenerationSuccess(key, prompt);
      // invalidate the credits query
      const creditKey = API_ROUTES.USER.GET_CREDIT;
      queryClient.invalidateQueries({
        queryKey: [creditKey],
      });
    },
    onError: () => {
      logoGenerationError(key);
    },
    onMutate: ({ payload }) => {
      logoGenerationMutate(key, payload.numberOfImages);
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
};
export const useDallEProjectGenerationMutation = (subProjectId: string) => {
  const { setIsLoading } = usePromptStore();
  const key = [
    API_ROUTES.SUB_PROJECTS.GET_SUB_PROJECT_PROMPTS_BY_ID(subProjectId),
  ];
  return useMutation({
    mutationFn: dallEGenerateLogoRequest,
    onSuccess: async (prompt) => {
      logoGenerationSuccess(key, prompt);
      // invalidate the credits query
      const creditKey = API_ROUTES.USER.GET_CREDIT;
      queryClient.invalidateQueries({
        queryKey: [creditKey],
      });
    },
    onError: () => {
      logoGenerationError(key);
    },
    onMutate: ({ payload }) => {
      logoGenerationMutate(key, payload.numberOfImages);
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
};

// img2img mutation request
export const img2imgRequest = async ({
  subProjectId,
  imageId,
  payload,
}: {
  subProjectId: string;
  payload: Img2ImgGenerate;
  imageId?: string;
}) => {
  try {
    const formdata = new FormData();
    formdata.append("elephantBrain", payload.elephantBrain);
    formdata.append("elephantModel", payload.elephantModel);
    formdata.append("prompt", payload.prompt);
    formdata.append("negativePrompt", payload.negativePrompt || "");
    formdata.append("cfg", payload.cfg.toString());
    formdata.append("quality", payload.quality.toString());
    formdata.append("seed", payload.seed.toString());
    formdata.append("numberOfImages", payload.numberOfImages.toString());
    if (payload.height && payload.width) {
      formdata.append("height", payload.height.toString());
      formdata.append("width", payload.width.toString());
    }
    if (payload.initImage) {
      const base64 = await urlToBase64(payload.initImage);

      if (typeof base64 === "string") {
        formdata.append("initImage", base64);
      }
    } else if (payload.sketchBase64) {
      formdata.append("initImage", payload.sketchBase64);
    } else {
      throw new Error(
        "Invalid Payload - Both SketchBase64 and InitialImage are missing"
      );
    }
    if (payload.maskImage) {
      formdata.append("maskImage", payload.maskImage);
    }

    // call server action
    const data = await generateImage2ImageAction({
      data: formdata,
      subProjectId,
      imageId: imageId,
    });
    if (!data) throw new Error("Failed to generate image");
    return data as IProjectPrompt;
  } catch (err) {
    throw err;
  }
};

export const useImg2ImgMutation = (subProjectId: string) => {
  const projects = queryClient.getQueryData<ICurrentUserProjectsList[]>([
    API_ROUTES.PROJECTS.CURRENT_USER_PROJECTS,
  ]);
  let id = subProjectId;
  const findProject = projects?.find((project) => {
    return (
      project.subProjects[0].id === +id &&
      project.subProjects[0].type === "PLAYGROUND"
    );
  });
  if (findProject) {
    id = "playground";
  }

  const key = [API_ROUTES.SUB_PROJECTS.GET_SUB_PROJECT_PROMPTS_BY_ID(id)];
  const { setIsLoading } = usePromptStore();
  return useMutation({
    mutationFn: img2imgRequest,
    onSuccess: (data) => {
      logoGenerationSuccess(key, data);
      // invalidate the credits query
      const creditKey = API_ROUTES.USER.GET_CREDIT;
      queryClient.invalidateQueries({
        queryKey: [creditKey],
      });
    },
    onError: () => {
      logoGenerationError(key);
    },
    onMutate: ({ payload }) => {
      logoGenerationMutate(key, payload.numberOfImages);
      setIsLoading(true);
    },
    onSettled: () => setIsLoading(false),
  });
};

export const toggleSubProjectBookmarkRequest = async (params: {
  subProjectId: string;
  imageId: string;
  promptId: number;
}) => {
  if (isNaN(+params.subProjectId) || isNaN(+params.imageId)) {
    throw new Error("Invalid params");
  }
  return await toggleImageBookmark({
    subProjectId: +params.subProjectId,
    imageId: +params.imageId,
  });
};
export const useToggleBookmarkMutation = () => {
  return useMutation({
    mutationFn: toggleSubProjectBookmarkRequest,
    onSettled: (bookmarkWithImage, err, variables) => {
      if (!err) {
        const subProjectByIdKey = [
          API_ROUTES.SUB_PROJECTS.GET_SUB_PROJECT_PROMPTS_BY_ID(
            variables.subProjectId
          ),
        ];
        const subProjectBookmarksKey = [
          API_ROUTES.SUB_PROJECT_BOOKMARK.GET_SUB_PROJECT_BOOKMARKS(
            +variables.subProjectId
          ),
        ];
        // created a bookmark
        queryClient.setQueryData<ISubProjectByIdResponseModel>(
          subProjectByIdKey,
          (data) => {
            if (data) {
              const newData = { ...data };
              newData.prompts = [...data.prompts];
              // find the prompt
              const promptIndex = newData.prompts.findIndex(
                (prompt) => prompt.id === variables.promptId
              );
              if (promptIndex > -1) {
                const prompt = newData.prompts[promptIndex];
                const imageIndex = prompt.images.findIndex(
                  (image) => image.id === +variables.imageId
                );
                if (imageIndex > -1) {
                  newData.prompts[promptIndex].images[
                    imageIndex
                  ].subProjectBookmark = bookmarkWithImage || null;
                  return newData;
                }
              }
            }
            return data;
          }
        );

        queryClient.setQueryData<ISubProjectBookmarks>(
          subProjectBookmarksKey,
          (data) => {
            if (data?.subProjectBookmarks) {
              const newData = { ...data };
              const subProjectBookmarks = [...data.subProjectBookmarks];
              if (bookmarkWithImage?.id) {
                // add bookmark
                subProjectBookmarks.push(bookmarkWithImage);
              } else {
                // remove bookmark
                const itemIndex = subProjectBookmarks.findIndex(
                  (item) => item.imageId === +variables.imageId
                );
                if (itemIndex > -1) {
                  subProjectBookmarks.splice(itemIndex, 1);
                }
              }
              newData.subProjectBookmarks = subProjectBookmarks;
              return newData;
            }
            return data;
          }
        );
      }
    },
  });
};
