import {
  createTag,
  getTagsBySearchQuery,
  getTopTagsData,
} from "@/actions/feed/tags";

type ICreateTagRequestPayload = {
  tag: string;
};

export const createTagRequest = async (payload: ICreateTagRequestPayload) => {
  return await createTag({ body: payload });
};

export const searchTags = async (query: string) => {
  return await getTagsBySearchQuery(query);
};

export const getTopTags = async () => {
  return await getTopTagsData();
};
