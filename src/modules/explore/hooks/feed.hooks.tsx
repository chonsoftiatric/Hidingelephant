import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  getFeed,
  getFeedImage,
  shareImageToFeedService,
} from "../services/feed.service";
import { queryClient } from "@/providers/TanstackProvider";
import { IGetFeedHookParams } from "../types/feed.types";
import { useFeedQueryStore } from "../store/feedquery.store";
import { useEffect } from "react";
import { ISubProjectByIdResponseModel } from "@/modules/project/types/api.response.types";
import { API_ROUTES } from "@/utils/API_ROUTES";

export const usePostFeed = ({
  subProjectId,
  imageId,
  cb,
}: {
  subProjectId: string;
  imageId: number;
  cb?: () => void;
}) => {
  const subProjectQueryKey =
    API_ROUTES.SUB_PROJECTS.GET_SUB_PROJECT_PROMPTS_BY_ID(subProjectId);

  return useMutation({
    mutationFn: shareImageToFeedService,
    onSuccess: () => {
      queryClient.setQueryData<ISubProjectByIdResponseModel>(
        [subProjectQueryKey],
        (subprojects) => {
          if (subprojects && subprojects.prompts) {
            const updatedSubProject = JSON.parse(
              JSON.stringify(subprojects)
            ) as ISubProjectByIdResponseModel;
            const updatedPrompts = [...updatedSubProject.prompts];
            updatedPrompts.forEach((item) => {
              const image = item.images.find((image) => image.id === imageId);
              if (image) {
                image.isPrivate = false;
              }
            });
            updatedSubProject.prompts = updatedPrompts;
            return updatedSubProject;
          }
        }
      );
      queryClient.invalidateQueries({ queryKey: ["post-feed"] });
      if (cb) {
        cb();
      }
    },
  });
};

export const useGetFeed = ({ tag, sortBy, username }: IGetFeedHookParams) => {
  const { setUsername, setTag, setSortBy } = useFeedQueryStore();

  useEffect(() => {
    setUsername(username);
    setSortBy(sortBy);
    setTag(tag);
  }, [tag, sortBy, username, setUsername, setSortBy, setTag]);

  return useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ["get-feed", { tag, sortBy, username }],
    queryFn: (params) =>
      getFeed({ offset: params.pageParam, tag, sortBy, username }),
    getNextPageParam: (lastPage) => (lastPage ? lastPage?.offset + 12 : 0),
    // refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useGetFeedImage = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["get-feed-image", { id }],
    queryFn: () => getFeedImage({ id }),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
