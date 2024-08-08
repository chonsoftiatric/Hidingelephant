import React from "react";
import LocalIcon from "@/components/icons/LocalIcon";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  deleteProjectRequest,
  updateProjectRequest,
} from "@/services/project.service";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BookmarkIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { queryClient } from "@/providers/TanstackProvider";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import UpdateSubProjectVisibility from "@/components/dialogs/update-subproject-visibility";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ICurrentUserProjectsList } from "@/types/project.types";
import ShareSubProjectDialog from "@/components/dialogs/share-subproject";

const isActive = "text-primary-default bg-[#CCE1FF]  card";
const ProjectNavList = ({
  id,
  data,
}: {
  id: string;
  data: ICurrentUserProjectsList[] | undefined;
}) => {
  const [projectToEdit, setProjectToEdit] = React.useState<number>();
  const [projectName, setProjectName] = React.useState("");

  // MUTATION
  const { mutateAsync: deleteProject } = useMutation({
    mutationFn: deleteProjectRequest,
    onSuccess: () => {
      // invalidate queries
      queryClient.invalidateQueries({
        queryKey: [API_ROUTES.PROJECTS.CURRENT_USER_PROJECTS],
      });
    },
  });
  const { mutateAsync: updateProject } = useMutation({
    mutationFn: updateProjectRequest,
    onSuccess: () => {
      // invalidate queries
      queryClient.invalidateQueries({
        queryKey: [API_ROUTES.PROJECTS.CURRENT_USER_PROJECTS],
      });
    },
    onSettled: () => {
      clearEditing(); // @todo - move in onSuccess callback
    },
  });

  const clearEditing = () => {
    setProjectToEdit(undefined);
    setProjectName("");
  };

  const handleDeleteProject = (projectId: string) => {
    const deleteProjectPromise = deleteProject(projectId);
    toast.promise(deleteProjectPromise, {
      loading: "Deleting project...",
      success: "Project deleted successfully",
      error: (err) => err.message,
    });
  };
  const handleProjectNameUpdate = (projectId: string) => {
    const updateProjectPromise = updateProject({
      id: projectId,
      payload: {
        name: projectName,
      },
    });
    toast.promise(updateProjectPromise, {
      loading: "Updating project...",
      success: "Project updated successfully",
      error: (err) => err.message,
    });
  };

  React.useEffect(() => {
    if (id) {
      localStorage.setItem("go-back", `/p/${id}`);
    }
  }, [id]);

  return (
    <div className="flex flex-col-reverse gap-2">
      {data?.map((project) => (
        <div key={`project-${project.name}`}>
          {project.id === projectToEdit ? (
            <div className="flex justify-between items-center p-2">
              <Input
                autoFocus
                className="outline-none w-36 h-8 text-md"
                value={projectName}
                placeholder="project name..."
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleProjectNameUpdate(project.id.toString());
                  }
                }}
                // onBlur={() => handleProjectNameUpdate(project.id.toString())}
              />
              <button
                onClick={() => handleProjectNameUpdate(project.id.toString())}
                className="p-1 bg-primary-default/20 rounded-md ml-2"
              >
                <CheckIcon className="stroke-primary-default" size={20} />
              </button>
            </div>
          ) : (
            <div
              className={cn(
                "w-full rounded-xl cursor-pointer hover:bg-[#CCE1FF] hover:card hover:text-primary-default",
                project?.subProjects[0]?.id.toString() === id ? isActive : ""
              )}
            >
              <div className="flex justify-between items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <UpdateSubProjectVisibility
                      initialVisibility={project.subProjects[0].visibility}
                      projectId={project.subProjects[0].id}
                    >
                      <button>
                        {project.subProjects[0]?.visibility === "PRIVATE" ? (
                          <EyeOffIcon className="inline-block ml-2" />
                        ) : (
                          <EyeIcon className="inline-block ml-2" />
                        )}
                      </button>
                    </UpdateSubProjectVisibility>
                  </TooltipTrigger>
                  <TooltipContent>
                    {project.subProjects[0]?.visibility === "PRIVATE" ? (
                      <>
                        This project is private, and does not appear in the{" "}
                        <Link
                          className="underline text-primary-default"
                          href="/explore/live"
                          target="_blank"
                        >
                          Live Feed
                        </Link>
                      </>
                    ) : (
                      <>
                        This project is visible in the{" "}
                        <Link
                          className="underline text-primary-default"
                          href="/explore/live"
                          target="_blank"
                        >
                          Live Feed
                        </Link>
                      </>
                    )}
                  </TooltipContent>
                </Tooltip>
                <Link
                  href={`/p/${project.subProjects[0]?.id || ""}`}
                  className="font-semibold flex-1 p-3"
                  scroll={false}
                >
                  {project.name.length > 14
                    ? project.name.slice(0, 12) + "..."
                    : project.name}
                </Link>

                <Popover>
                  <PopoverTrigger asChild>
                    <button onClick={clearEditing} className="p-2 pr-4">
                      <LocalIcon icon="dots-horizontal" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="rounded-xl p-3">
                    <div className="flex flex-col gap-3">
                      <UpdateSubProjectVisibility
                        initialVisibility={project.subProjects[0].visibility}
                        projectId={project.subProjects[0].id}
                      >
                        <button className="flex items-center gap-4">
                          <EyeIcon size={20} />
                          <span className="hover:text-primary-default">
                            Visibility
                          </span>
                        </button>
                      </UpdateSubProjectVisibility>
                      <ShareSubProjectDialog
                        subProjectId={project.subProjects[0].id}
                        isShared={project.subProjects[0].isShared}
                        shareHash={
                          project.subProjects[0].shareHash || undefined
                        }
                      />
                      <button className="flex items-center gap-4">
                        <BookmarkIcon size={20} />
                        <span className="hover:text-primary-default">
                          Bookmarks
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setProjectToEdit(project.id);
                          setProjectName(project.name);
                        }}
                        className="flex items-center gap-4"
                      >
                        <PencilIcon size={20} />
                        <span className="hover:text-primary-default">
                          Edit name
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteProject(project.id.toString())
                        }
                        className="flex items-center gap-4"
                      >
                        <TrashIcon size={20} className="stroke-red-500" />
                        <span className="text-red-500">Delete</span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectNavList;
