import { useMutation } from "@tanstack/react-query";
import { toggleFeedImageLikeRequest } from "../services/likes.service";
import { useRouter } from "next/navigation";
import { queryClient } from "@/providers/TanstackProvider";

export const useFeedImageLikeToggle = ({ id }: { id: string }) => {
  const router = useRouter();
  return useMutation({
    mutationKey: ["like-feedimage"],
    mutationFn: toggleFeedImageLikeRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-feed-image", { id }] });
      router.refresh();
    },
  });
};
