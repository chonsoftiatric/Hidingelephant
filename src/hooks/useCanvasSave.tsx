import { useCanvasMutation } from "@/modules/canvas/service/canvas.mutations";
import toast from "react-hot-toast";
import { useReactFlow } from "reactflow";

const useCanvasSave = () => {
  const { mutateAsync } = useCanvasMutation();
  const { getNodes, getEdges } = useReactFlow();
  const handleCanvasSave = (canvasId: string) => {
    const nodes = getNodes();
    if (nodes.length === 0) return;
    const edges = getEdges();
    const addToCanvasPromise = mutateAsync({
      id: canvasId,
      payload: {
        nodes: nodes,
        edges: edges,
      },
    });
    return addToCanvasPromise;
  };
  return {
    handleCanvasSave,
  };
};

export default useCanvasSave;
