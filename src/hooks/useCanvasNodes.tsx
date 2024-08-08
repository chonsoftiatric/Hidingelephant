import { useCallback } from "react";
import { Edge, Node, useReactFlow } from "reactflow";
import {
  IAddNode,
  createNode,
  createPromptNode,
  createTextNode,
} from "@/modules/canvas/utils/canvas.utils";
import useCanvasSave from "@/hooks/useCanvasSave";
import toast from "react-hot-toast";
import { useCanvasQuery } from "@/modules/canvas/service/canvas.queries";
import { useCanvasMutation } from "@/modules/canvas/service/canvas.mutations";
import { useParams, useRouter } from "next/navigation";
import { ImageNodeData } from "@/modules/canvas/components/ImageNode";
import { TextNodeData } from "@/modules/canvas/components/TextNode";
import { useCanvasStore } from "@/modules/canvas/store/canvas.store";
import {
  HandleSendToCanvas,
  HandleAddNodesProps,
} from "@/modules/canvas/types/canvas.types";

const useCanvasNodes = (canvasId?: string) => {
  const params = useParams();
  const canvasParamId = params.id as string;
  if (!canvasId) {
    canvasId = canvasParamId;
  }
  const { data } = useCanvasQuery(canvasId);
  const router = useRouter();
  const {
    getNodes,
    setNodes: setCanvasNodes,
    setEdges: setCanvasEdges,
    fitView,
  } = useReactFlow();
  const { handleCanvasSave } = useCanvasSave();
  const { mutateAsync } = useCanvasMutation();
  const { setUnsavedChanges } = useCanvasStore();

  const setNodes = (nodes: Node[] | ((node: Node[]) => Node[])) => {
    setUnsavedChanges(true);
    setCanvasNodes(nodes);
  };
  const setEdges = (edges: Edge[] | ((edges: Edge[]) => Edge[])) => {
    setUnsavedChanges(true);
    setCanvasEdges(edges);
  };

  const zoomToNode = (nodeId: string) => {
    fitView({ nodes: [{ id: nodeId }], padding: 0.1 });
  };

  const handleSendToCanvas = ({ image, prompt }: HandleSendToCanvas) => {
    if (!canvasId || !data) return;
    const canvasNodeSchema = data.canvas;
    if (!canvasNodeSchema) return;
    const position: Node["position"] = {
      x: Math.floor(Math.random() * (window.innerWidth / 5)) + 50,
      y: window.innerHeight / 2,
    };
    const node = createNode({
      image: {
        ...image,
        feedImage: {
          id: image.feedImage?.id,
        },
      },
      prompt,
      position,
    });
    canvasNodeSchema.nodeSchema.nodes = [
      ...canvasNodeSchema.nodeSchema.nodes,
      node,
    ];
    const addToCanvasPromise = mutateAsync({
      id: canvasId,
      payload: canvasNodeSchema.nodeSchema,
    });
    toast.promise(addToCanvasPromise, {
      loading: "Adding image to canvas...",
      success: "Image added to canvas",
      error: (err) => err.message,
    });
    router.replace(`/canvas/${canvasId}`);
  };

  const handleAddNodes = useCallback(
    ({
      images,
      activeNodeId,
      prompt,
      withSave = true,
      promptNodePosition,
      isSinleImage = false,
    }: HandleAddNodesProps) => {
      const nodes = getNodes();
      const targetNode = activeNodeId
        ? nodes.find((node) => node.id === activeNodeId)
        : createPromptNode(prompt, promptNodePosition);
      if (!targetNode) return;

      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      for (let i = 0; i < images.length; i++) {
        const dbImage = images[i];

        const image: IAddNode["image"] = {
          id: dbImage.id,
          imageUrl: dbImage.imageUrl,
          generated_prompt: dbImage.generated_prompt,
          isPrivate: dbImage.isPrivate,
          feedImage: {
            id: dbImage?.feedImage?.id,
          },
        };

        const node = createNode({
          image,
          prompt,
          position: {
            x: !isSinleImage
              ? targetNode.position.x - 150 + i * 150
              : targetNode.position.x,
            y: targetNode.position.y + 200,
          },
        });

        newNodes.push(node);

        const edge: Edge = {
          id: `edge-${node.id}`,
          target: node.id,
          source: targetNode.id,
        };
        newEdges.push(edge);
      }

      // Save Canvas
      if (withSave && canvasId) {
        setTimeout(() => {
          handleCanvasSave(String(canvasId));
          zoomToNode(targetNode.id);
        }, 3000);
      }

      setNodes((nds) => {
        const updatedNodes = [...nds, ...newNodes];
        if (!activeNodeId) {
          updatedNodes.push(targetNode);
        }
        return updatedNodes;
      });
      setEdges((eds) => [...eds, ...newEdges]);
    },
    [getNodes, setNodes, setEdges]
  );

  const removeNode = (nodeId: string) => {
    const nodes = getNodes();
    const node = nodes.find((node) => node.id === nodeId);
    if (!node) return;
    // filter out the edges
    setNodes(nodes.filter((node) => node.id !== nodeId));
    setEdges((edges: Edge[]) =>
      edges.filter((edge) => edge.target !== node.id && edge.source !== node.id)
    );
  };

  const removeNodeBookmark = (nodeId: string): void => {
    const nodes = getNodes() as unknown as Node<ImageNodeData>[];
    const nodeIndex = nodes.findIndex((node) => node.id === nodeId);
    const node = nodes[nodeIndex];
    if (!node) return;

    if (node.data.bookmarkId) {
      node.data.bookmarkId = undefined;
    }
    setNodes(nodes);
  };

  // Text Nodes
  const handleAddTextNode = () => {
    const nodes = getNodes();
    const newTextNode = createTextNode({});
    setNodes([...nodes, newTextNode]);
  };
  const handleNodeTextChange = ({
    nodeId,
    data,
  }: {
    nodeId: string;
    data: TextNodeData;
  }) => {
    const nodes = getNodes();
    const node = nodes.find((node) => node.id === nodeId);
    if (node) {
      node.data = data;
      setNodes([...nodes, node]);
    }
  };

  return {
    handleAddNodes,
    removeNode,
    handleSendToCanvas,
    zoomToNode,
    removeNodeBookmark,
    handleAddTextNode,
    handleNodeTextChange,
  };
};

export default useCanvasNodes;
