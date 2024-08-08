import { ImageNodeData } from "@/modules/canvas/components/ImageNode";
import { TextNodeProps } from "@/modules/canvas/components/TextNode";
import { IProjectPrompt } from "@/modules/project/types/common.types";
import { Image, IPrompt } from "@/types/db.schema.types";
import { Node } from "reactflow";
import { v4 } from "uuid";

export type IAddNode = {
  image: Pick<Image, "id" | "imageUrl" | "generated_prompt" | "isPrivate"> & {
    feedImage:
      | {
          id: number | undefined;
        }
      | null
      | undefined;
  };
  prompt: IPrompt;
  position?: Node["position"];
};

export const generateNewNode = ({ image, prompt }: IAddNode) => {
  const { id, ...rest } = prompt;
  const nodeData: ImageNodeData = {
    label: imageLabel,
    imageUrl: image.imageUrl,
    imageId: image.id,
    isPrivate: image.isPrivate,
    feeddImageId: image?.feedImage?.id,
    generatedPrompt: image.generated_prompt,
    bookmarkId: undefined,
    promptId: id,
    ...rest,
  };
  return nodeData;
};

const imageLabel = "image";
export const createNode = ({ image, position, prompt }: IAddNode): Node => {
  const nodeData = generateNewNode({ image, prompt });
  const node = {
    id: `image-${image.id}`,
    data: nodeData,
    type: "imageNode",
    position: position ? position : { x: 0, y: 0 },
  };
  return node;
};

export const createPromptNode = (
  prompt: IProjectPrompt,
  position?: Node["position"]
) => {
  const image = prompt.images[0];
  const nodeData = generateNewNode({ image, prompt });
  const node = {
    id: `prompt-${prompt.id}`,
    data: nodeData,
    type: "imageNode",
    position: position ? position : { x: 0, y: 0 },
  };
  return node;
};

// Text Node
type CreateTextNodeProps = {
  position?: Node["position"];
};
export const createTextNode = ({ position }: CreateTextNodeProps): Node => {
  const node: Node = {
    id: `text-${v4()}`,
    data: {
      text: "A",
      width: 200,
      height: 100,
    },
    type: "textNode",
    position: position ? position : { x: 0, y: 0 },
  };
  return node;
};
