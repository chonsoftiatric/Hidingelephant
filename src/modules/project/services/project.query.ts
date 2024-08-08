import { API_ROUTES } from "@/utils/API_ROUTES";
import { useQuery } from "@tanstack/react-query";
import { getSubProjectBookmarks } from "@/actions/sub-project-bookmark/getSubProjectBookmarks";
import { getSubProjectPromptsById } from "@/actions/sub-project";

// GET PROJECT BY ID [QUERY]
export const getSubProjectByIDRequest = async (id: string) => {
  return await getSubProjectPromptsById(id);
};

export const usePromptsList = (id: string) => {
  const url = API_ROUTES.SUB_PROJECTS.GET_SUB_PROJECT_PROMPTS_BY_ID(id);
  return useQuery({
    queryKey: [url],
    queryFn: () => getSubProjectByIDRequest(id),
    refetchOnWindowFocus: false,
    enabled: typeof id === "string",
    retry: 1,
    staleTime: 60 * 60 * 1000,
  });
};

// sub project bookmarks //
export const getSubProjectBookmarksRequest = async (subProjectId: number) => {
  return await getSubProjectBookmarks({ subProjectId });
};
export const useSubProjectBookmarks = (subProjectId: number) => {
  const key =
    API_ROUTES.SUB_PROJECT_BOOKMARK.GET_SUB_PROJECT_BOOKMARKS(subProjectId);
  return useQuery({
    queryKey: [key],
    queryFn: () => getSubProjectBookmarksRequest(subProjectId),
    enabled: typeof subProjectId === "number",
    retry: 1,
  });
};
