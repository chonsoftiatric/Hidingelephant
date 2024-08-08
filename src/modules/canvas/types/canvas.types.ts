import { IProjectPrompt } from "@/modules/project/types/common.types";
import {
  Image as ImageType,
  IPrompt,
  ISubProject,
} from "@/types/db.schema.types";
import { Edge, Node } from "reactflow";

export type NodeSchemaType = {
  nodes: Node[];
  edges: Edge[];
};

export type CanvasByIdResponse = {
  canvas: {
    id: number;
    nodeSchema: NodeSchemaType;
    bucketKey: string;
  };
  subProject: ISubProject;
};

export type ICanvasUpdate = {
  id: string;
  payload: NodeSchemaType;
};

export type CanvasStoreType = {
  unsavedChanges: boolean;
  setUnsavedChanges: (val: boolean) => void;
  selectedTool: CanvasToolsEnum;
  setSelectedTool: (val: CanvasToolsEnum) => void;
};

export const enum CanvasToolsEnum {
  SELECT,
  MULTISELECT,
}

export type DBImage = ImageType & { feedImage?: { id?: number } };
export type HandleAddNodesProps = {
  images: DBImage[];
  activeNodeId?: string;
  prompt: IProjectPrompt;
  withSave?: boolean;
  promptNodePosition?: { x: number; y: number };
  isSinleImage?: boolean;
};
export type HandleSendToCanvas = {
  image: DBImage;
  prompt: IPrompt;
};
