import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { getComments, postComment } from "../services/comments.service";
import { queryClient } from "@/providers/TanstackProvider";

export const usePostComment = ({ id }: { id: string }) => {
  return useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-comments", { id }],
      });
    },
  });
};

export const useGetComments = ({ id }: { id: string }) => {
  return useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ["get-comments", { id }],
    queryFn: (params) => getComments({ offset: params.pageParam, id }),
    getNextPageParam: (lastPage) => lastPage.offset + 12,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
