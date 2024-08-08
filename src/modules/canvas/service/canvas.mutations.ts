import { updateCanvasById } from "@/actions/canvas/actions";
import { ICanvasUpdate } from "@/modules/canvas/types/canvas.types";
import { queryClient } from "@/providers/TanstackProvider";
import { useMutation } from "@tanstack/react-query";
import { useCanvasStore } from "../store/canvas.store";

export const updateCanvasByIdRequest = async ({
  id,
  payload,
}: ICanvasUpdate) => {
  return await updateCanvasById(id, payload);
};

export const useCanvasMutation = () => {
  const { setUnsavedChanges } = useCanvasStore();
  return useMutation({
    mutationFn: updateCanvasByIdRequest,
    onSuccess: (canvasId) => {
      if (canvasId) {
        const key = `get-canvas-by-id-${canvasId}`;
        queryClient.invalidateQueries({
          queryKey: [key],
        });
      }
      setUnsavedChanges(false);
    },
    onError: () => {
      setUnsavedChanges(true);
    },
  });
};
