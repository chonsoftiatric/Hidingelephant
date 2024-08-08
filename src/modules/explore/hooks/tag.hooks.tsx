import { useQuery } from "@tanstack/react-query";
import { getTopTags } from "../services/tags.service";

export const useGetTopTags = () => {
  return useQuery({
    queryKey: ["get-top-tags"],
    queryFn: () => getTopTags(),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
