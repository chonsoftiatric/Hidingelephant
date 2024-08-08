"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  Node,
  NodeProps,
  SelectionMode,
} from "reactflow";
import {
  ImageNode,
  ImageNodeData,
  ImageNodeProps,
} from "../components/ImageNode";
import "reactflow/dist/style.css";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import ImageNodeActionBar from "@/modules/canvas/components/ImageNodeActionBar";
import PromptBar from "@/modules/project/elements/PromptBar";
import useCanvasNodes from "@/hooks/useCanvasNodes";
import CanvasNavbar from "@/modules/canvas/components/layout/CanvasNavbar";
import { ISubProject } from "@/types/db.schema.types";
import { useModelSettings } from "@/services/vercel-kv.service";
import { arrayToObj } from "@/utils/fn.frontend";
import useDebouncedFunction from "@/hooks/useDebouncedFunction";
import useCanvasSave from "@/hooks/useCanvasSave";
import TextNode, { TextNodeProps } from "@/modules/canvas/components/TextNode";
import "react-resizable/css/styles.css";
import CustomControls from "@/modules/canvas/components/elements/CustomControls";
import { useCanvasStore } from "../store/canvas.store";
import { CanvasToolsEnum } from "../types/canvas.types";

interface CanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  canvasId: string;
  saveKey: string;
  subProject: ISubProject;
}

export const Canvas = (props: CanvasProps) => {
  const { unsavedChanges, setUnsavedChanges, selectedTool } = useCanvasStore();
  const { data: modelSettings } = useModelSettings();
  const modelsObj = React.useMemo(() => {
    return arrayToObj(modelSettings?.models || []);
  }, [modelSettings]);
  const methodsObj = React.useMemo(() => {
    return arrayToObj(modelSettings?.methods || []);
  }, [modelSettings]);
  const [isNodesLocked, setIsNodesLocked] = useState<boolean>(false);
  const { handleAddNodes } = useCanvasNodes();
  const { handleCanvasSave } = useCanvasSave();
  const [nodes, setNodes, onNodesChange] = useNodesState(props.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.initialEdges);
  const [activeImage, setActiveImage] = React.useState<ImageNodeProps>();
  const nodeTypes = useMemo(
    () => ({
      imageNode: (imgProps: NodeProps<ImageNodeData>) => (
        <ImageNode
          {...imgProps}
          modelObj={modelsObj}
          methodObj={methodsObj}
          canvasId={props.canvasId}
          subProjectId={props.subProject.id}
          saveKey={props.saveKey}
          setActiveImage={setActiveImage}
        />
      ),
      textNode: (textProps: TextNodeProps) => <TextNode {...textProps} />,
      dummyNode: () => <></>,
    }),
    []
  );
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const debouncedSaveCanvasState = useDebouncedFunction();

  const handleNodePositionChange = () => {
    const canvasId = props.canvasId;
    debouncedSaveCanvasState(() => {
      handleCanvasSave(canvasId);
    }, 5000);
  };

  useEffect(() => {
    console.log("set unset changes to false");
    setUnsavedChanges(false);
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsavedChanges]);

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (unsavedChanges) {
      console.log("unsaved changes", unsavedChanges);
      event.returnValue = "You have unfinished changes";
    }
  };

  return (
    <div className={"h-screen w-screen relative"}>
      {/* CanvasNavbar */}
      <CanvasNavbar subProject={props.subProject} />
      <Dialog
        open={Boolean(activeImage)}
        onOpenChange={() => setActiveImage(undefined)}
      >
        <DialogContent className="max-w-3xl">
          {activeImage ? (
            <>
              <Image
                alt={activeImage.data.label}
                src={activeImage.data.imageUrl}
                className="rounded-lg"
                height={1000}
                width={1000}
              />
              <ImageNodeActionBar
                {...activeImage}
                subProjectId={props.canvasId}
              />
            </>
          ) : (
            <div className="h-[400px]"></div>
          )}
        </DialogContent>
      </Dialog>

      {/* Prompt Bar */}

      <div className="w-full max-w-[700px] left-[50%] -translate-x-[50%] absolute bottom-10 z-[9] mx-auto">
        <PromptBar handleAddNodes={handleAddNodes} />
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeDrag={() => {
          setUnsavedChanges(true);
        }}
        onNodesChange={(changes) => {
          onNodesChange(changes);
        }}
        onEdgesChange={(changes) => {
          onEdgesChange(changes);
        }}
        isValidConnection={() => false}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onConnectEnd={(e) => e.preventDefault()}
        onNodeDragStop={handleNodePositionChange}
        nodesDraggable={!isNodesLocked}
        nodesConnectable={!isNodesLocked}
        elementsSelectable={!isNodesLocked}
        fitView
        selectionOnDrag={selectedTool === CanvasToolsEnum.MULTISELECT}
        panOnDrag={selectedTool === CanvasToolsEnum.SELECT}
        selectionMode={SelectionMode.Partial}
      >
        <MiniMap />
        <CustomControls
          isLocked={isNodesLocked}
          setIsLocked={setIsNodesLocked}
        />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};
