import React from "react";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGlobalStore } from "@/store/global";
import { Node, NodeProps, useReactFlow } from "reactflow";
import useFeatureAccess from "@/hooks/useFeatureAccess";
import { ImageNodeProps, type ImageNodeData } from "./ImageNode";
import { LuSparkles } from "react-icons/lu";
import { BiEditAlt } from "react-icons/bi";
import { HiDownload, HiOutlineBookmark } from "react-icons/hi";
import {
  ArrowLeftIcon,
  LucideExpand,
  SplineIcon,
  TrashIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useToggleBookmarkMutation } from "@/modules/project/services/project.mutation";
import useCanvasNodes from "@/hooks/useCanvasNodes";
import { usePromptStore } from "@/store/prompt-settings";
import { formattedPrompt } from "@/utils";
import useCanvasSave from "@/hooks/useCanvasSave";
import { ShareImageModal } from "@/modules/explore/components/ShareImageModal";
import { DALL_E_MODEL } from "@/utils/CONSTANTS";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const ImageNodeActionBar = (props: ImageNodeProps & { className?: string }) => {
  const promptState = usePromptStore();
  const isGV = promptState.elephantBrain === "GV";
  const isDALLE = promptState.elephantBrain === DALL_E_MODEL;
  const feedImageIdProp = props.data.feeddImageId;
  const [feedImageId, setFeedImageId] = React.useState<number | undefined>(
    feedImageIdProp
  );
  const { handleCanvasSave } = useCanvasSave();
  const { getNodes, setNodes } = useReactFlow();
  const { handleAddNodes, removeNode } = useCanvasNodes();
  const { hasFeatureAccess } = useFeatureAccess();
  const { setPrompt } = usePromptStore();
  const {
    updateEditImageModal,
    setGenerateSimilarImage,
    updateVectorizeModal,
    setBookmarkPopoverOpen,
  } = useGlobalStore();

  const { mutateAsync } = useToggleBookmarkMutation();

  const handleBookmark = () => {
    const toggleBookmarkPromise = mutateAsync({
      subProjectId: String(props.subProjectId),
      imageId: props.data.imageId.toString(),
      promptId: props.data.promptId,
    });
    const removing = Boolean(props.data.bookmarkId);
    toast
      .promise(toggleBookmarkPromise, {
        loading: `${removing ? "Removing" : "Adding"} image to bookmarks...`,
        success: `Image ${removing ? "removed" : "added"}  to bookmarks`,
        error: `Bookmark ${removing ? "remove" : "add"} failed`,
      })
      .then((data) => {
        setBookmarkPopoverOpen(true);
        // update the node data
        const nodes = getNodes() as Node<ImageNodeData>[];
        const targetNode = nodes.find((node) => node.id === props.id);
        if (targetNode) {
          targetNode.data.bookmarkId = data?.id;
          setNodes([...nodes]);
        }
      });
    setTimeout(() => handleCanvasSave(`${props.canvasId}`), 1000);
  };

  const handleDownloadImage = async () => {
    const access = hasFeatureAccess("download");
    if (!access) return;
    const res = await fetch(props.data.imageUrl);
    const blob = await res.blob();
    saveAs(blob, "image.png");
  };
  const handleNodeFeedUpdate = (imageId: number, feedImageId: number) => {
    const nodes = getNodes() as Node<ImageNodeData>[];
    const targetNode = nodes.find((node) => node.id === `image-${imageId}`);
    if (targetNode) {
      targetNode.data.feeddImageId = feedImageId;
      setFeedImageId(feedImageId);
      setNodes([...nodes]);
    }
  };

  return (
    <div className={cn("grid grid-cols-4 gap-2", props.className)}>
      <ShareImageModal
        subProjectId={props.subProjectId.toString()}
        imageUrl={props.data.imageUrl}
        isPrivate={props.data.isPrivate}
        imageId={+props.data.imageId}
        feedImageId={feedImageId}
        updateCanvasNode={handleNodeFeedUpdate}
        isDark
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-600">
                <TrashIcon size={22} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div>
                <div className="flex justify-center items-center ">
                  <TrashIcon
                    size={65}
                    className="bg-red-50 p-4 rounded-full stroke-red-500"
                  />
                </div>
                <h2 className="text-center text-xl sm:text-2xl font-medium mt-3">
                  Are you sure you want to delete this image?
                </h2>
                <div className="flex justify-center items-center gap-3 mt-5">
                  <Button>
                    <ArrowLeftIcon size={22} className="mr-2" />
                    Cancel
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => removeNode(props.id)}
                  >
                    <TrashIcon size={22} className="mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>Remove Image</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleBookmark}>
            <HiOutlineBookmark
              className={props.data.bookmarkId ? "fill-white" : ""}
              size={22}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {props.data.bookmarkId ? "Remove Bookmark" : "Bookmark Image"}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              // update the prompt
              setPrompt(formattedPrompt(props.data.prompt));
              setGenerateSimilarImage({
                subProjectId: +props.subProjectId,
                id: props.data.imageId.toString(),
                imageUrl: props.data.imageUrl,
                cb: (data) => {
                  const images = data?.images;
                  if (images) {
                    handleAddNodes({
                      images: images.map((image) => ({
                        ...image,
                        feedImage: undefined,
                      })),
                      activeNodeId: props.id.toString(),
                      prompt: data,
                    });
                  }
                },
              });
            }}
            disabled={isGV}
          >
            <LuSparkles size={22} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Generate Simillar</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              updateEditImageModal({
                id: props.data.imageId.toString(),
                imageUrl: props.data.imageUrl,
                cb: (data) => {
                  const images = data?.images;
                  if (images) {
                    handleAddNodes({
                      images: images.map((image) => ({
                        ...image,
                        feedImage: undefined,
                      })),
                      activeNodeId: props.id.toString(),
                      prompt: data,
                    });
                  }
                },
              });
            }}
            disabled={isGV || isDALLE}
          >
            <BiEditAlt size={22} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit Image</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              const hasAccess = hasFeatureAccess("vectorize");
              if (!hasAccess) return;

              updateVectorizeModal({
                open: true,
                id: props.data.imageId,
                imageUrl: props.data.imageUrl,
                saveKey: props.saveKey,
                subProjectId: props.subProjectId,
              });
            }}
          >
            <SplineIcon size={22} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Vectorize Image</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleDownloadImage}>
            <HiDownload size={22} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Download Image</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ImageNodeActionBar;
