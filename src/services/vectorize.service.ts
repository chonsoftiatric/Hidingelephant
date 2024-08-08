import axios from "axios";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { useQuery } from "@tanstack/react-query";
import { IVectorizedImage } from "@/types/db.schema.types";
import { IVectorizeOptions } from "@/schemas/vectorize/schema";
import {
  convertImageToVector,
  getSubProjectVectorizedImages,
  saveVectorizedImageToProject,
  vectorizeImageWithAI,
} from "@/actions/vectorize/vectorize";

type IVectorize_image = {
  url: string;
  id: number;
  options?: IVectorizeOptions;
};

export const vectorize_mutation = async ({
  url,
  options,
}: IVectorize_image) => {
  return await convertImageToVector({ url, options });
};

type ISaveVectorizedImage = {
  file: File;
  saveKey: string;
  imageId: number;
  subProjectId: string | number;
};

export const saveVectorizedImage = async ({
  file,
  saveKey,
  imageId,
  subProjectId,
}: ISaveVectorizedImage) => {
  const data = new FormData();
  data.set("file", file);
  data.set("saveKey", saveKey);
  data.set("imageId", imageId.toString());
  return await saveVectorizedImageToProject({
    subProjectId,
    form: data,
  });
};

export const vectorizeWithAI = async ({ imageUrl }: { imageUrl: string }) => {
  return await vectorizeImageWithAI({ imageUrl });
};

const getSavedVectorizedImage = async (subProjectId: string | number) => {
  return await getSubProjectVectorizedImages({
    subProjectId,
  });
};

export const useGetSavedVectorizedImage = (subProjectId: string | number) => {
  return useQuery({
    queryKey: [API_ROUTES.VECTORIZE.GET_SAVED_IMAGES(subProjectId)],
    queryFn: () => getSavedVectorizedImage(subProjectId),
    refetchOnWindowFocus: false,
  });
};
