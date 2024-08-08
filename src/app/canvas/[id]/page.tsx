"use client";
import { Canvas } from "@/modules/canvas/views/Canvas";

import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { useCanvasQuery } from "@/modules/canvas/service/canvas.queries";

export const maxDuration = 300; // Applies to the actions

const CanvasPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { data } = useCanvasQuery(id);
  const nodeSchema = data?.canvas?.nodeSchema;

  return (
    <div>
      {nodeSchema ? (
        <Canvas
          initialEdges={nodeSchema.edges}
          initialNodes={nodeSchema.nodes}
          canvasId={id}
          saveKey={data.bucketKey}
          subProject={data.canvas.subProject}
        />
      ) : (
        <div className="h-screen w-screen flex justify-center items-center">
          <Loader2 className="mr-4 h-4 w-4 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default CanvasPage;
