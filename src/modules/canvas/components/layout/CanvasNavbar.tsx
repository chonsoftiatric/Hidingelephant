import CreditBox from "@/modules/canvas/components/elements/CreditBox";
import { cn } from "@/lib/utils";
import {
  ALargeSmallIcon,
  ArrowLeftIcon,
  BoxSelectIcon,
  MousePointerIcon,
} from "lucide-react";
import PromptSettingDrawer from "@/modules/canvas/components/PromptSettingDrawer";
import useCanvasSave from "@/hooks/useCanvasSave";
import { useParams } from "next/navigation";
import VectorizePopover from "@/modules/project/elements/VectorizePopover";
import BookmarkPopover from "@/modules/project/elements/BookmarkPopover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ISubProject } from "@/types/db.schema.types";
import UserProfileMenu from "@/components/common/elements/UserProfileMenu";
import { useUserDetails } from "@/services/user.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useCanvasNodes from "@/hooks/useCanvasNodes";
import { useRouter } from "next/navigation";
import { useCanvasStore } from "../../store/canvas.store";
import toast from "react-hot-toast";
import { set } from "date-fns";
import { CanvasToolsEnum } from "../../types/canvas.types";

type CanvasNavbarProps = {
  subProject: ISubProject;
};

export default function CanvasNavbar({ subProject }: CanvasNavbarProps) {
  const { id } = useParams();
  const { data } = useUserDetails();
  const router = useRouter();
  const { unsavedChanges, selectedTool, setSelectedTool } = useCanvasStore();
  const canvasId = id as string;
  const { handleCanvasSave } = useCanvasSave();
  const { removeNodeBookmark, handleAddTextNode } = useCanvasNodes();
  const name = subProject.name;
  const formattedName = name.split("sub-project-")[1];

  return (
    <div className="fixed z-50 w-full flex items-center justify-between py-2 px-2 sm:px-6">
      {/* Project */}
      <div
        onClick={() => {
          if (unsavedChanges) {
            const addToCanvasPromise = handleCanvasSave(canvasId);
            if (addToCanvasPromise)
              toast.promise(addToCanvasPromise, {
                loading: "Saving the canvas...",
                success: "Canvas saved successfuly",
                error: (err) => err.message,
              });
          }
          router.push(`/p/${subProject.id}`);
        }}
        className="text-lg font-semibold flex items-center gap-2"
      >
        <ArrowLeftIcon />
        <span>{formattedName}</span>
      </div>

      <nav className="flex gap-4 items-center max-w-[600px] justify-between px-6 py-2 rounded-full bg-background shadow-lg bg-white">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setSelectedTool(CanvasToolsEnum.SELECT)}
              className={cn(
                "card z-10 flex h-10 w-10 bg-white border cursor-pointer  rounded-full justify-center items-center top-6 right-6"
              )}
            >
              <MousePointerIcon
                className={`hover:stroke-primary-default ${
                  selectedTool === CanvasToolsEnum.SELECT
                    ? "stroke-primary-default"
                    : "stroke-black"
                }`}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>Select</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setSelectedTool(CanvasToolsEnum.MULTISELECT)}
              className={cn(
                "card z-10 flex h-10 w-10 bg-white border cursor-pointer  rounded-full justify-center items-center top-6 right-6"
              )}
            >
              <BoxSelectIcon
                className={`hover:stroke-primary-default ${
                  selectedTool === CanvasToolsEnum.MULTISELECT
                    ? "stroke-primary-default"
                    : "stroke-black"
                }`}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>Multi Select</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => handleAddTextNode()}
              className={cn(
                "card z-10 flex h-10 w-10 bg-white border cursor-pointer  rounded-full justify-center items-center top-6 right-6"
              )}
            >
              <ALargeSmallIcon className="hover:stroke-primary-default" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Type text</TooltipContent>
        </Tooltip>
        <VectorizePopover subProjectId={subProject.id} className="static" />
        <BookmarkPopover
          className="static border"
          subProjectId={subProject.id}
          removeNodeBookmark={removeNodeBookmark}
        />
        <PromptSettingDrawer />
      </nav>
      {/* actions */}
      <div className="flex gap-6">
        <CreditBox className="my-0" isClosed={false} />
        <Popover>
          <PopoverTrigger>
            <Avatar className="h-14 w-14 border border-gray-300">
              <AvatarImage src={data?.profileImage || undefined} />
              <AvatarFallback className="text-sm uppercase">
                {data?.username}
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent>
            <UserProfileMenu username={data?.username || undefined} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
