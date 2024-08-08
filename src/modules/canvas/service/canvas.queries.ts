import { getCanvasById } from "@/actions/canvas/actions";
import { useQuery } from "@tanstack/react-query";

export const getCanvasByIdRequest = async (canvasId: string) => {
  return await getCanvasById(canvasId);
};
export const useCanvasQuery = (canvasId: string) => {
  const parsedSubProjectId = +canvasId;
  return useQuery({
    queryKey: ["get-canvas-by-id", canvasId],
    queryFn: () => getCanvasByIdRequest(canvasId),
    enabled: typeof parsedSubProjectId === "number",
    refetchOnWindowFocus: false,
  });
};
