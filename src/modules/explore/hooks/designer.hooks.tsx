import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  getDesigner,
  getDesignerFeed,
  updateDesignerProfile,
} from "../services/designer.service";
import { queryClient } from "@/providers/TanstackProvider";
import { IDesignerProfile } from "../types/designer.types";
import { useUserDetails } from "@/services/user.service";
import { API_ROUTES } from "@/utils/API_ROUTES";

export const useGetDesignerFeed = ({ id }: { id: string }) => {
  return useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ["get-designer-feed", { id }],
    queryFn: (params) => getDesignerFeed({ offset: params.pageParam, id }),
    getNextPageParam: (lastPage) => lastPage.offset + 12,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useGetDesigner = ({ username }: { username: string }) => {
  return useQuery({
    queryKey: ["get-designer", username],
    queryFn: () => getDesigner({ username }),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateDesigner = () => {
  const { data: user } = useUserDetails();
  return useMutation({
    mutationFn: updateDesignerProfile,
  });
};
