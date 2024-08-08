"use client";
import React from "react";

import Button from "@/components/common/button/Button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { IProjectCreatePayload } from "@/types/project.types";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { createProjectRequest } from "@/services/project.service";
import { queryClient } from "@/providers/TanstackProvider";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { usePlanDetails } from "@/services/stripe.service";
import { useSession } from "next-auth/react";
import { useUserDetails } from "@/services/user.service";
import { roleAccess } from "@/modules/project/utils/index.utils";

type INewProject = {
  iconOnly?: boolean;
  className?: string;
};
const NewProject = ({ iconOnly = false, className }: INewProject) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  const user = useUserDetails();
  const { data: plan } = usePlanDetails();

  const isPro =
    plan?.isSubscribed || roleAccess(["ADMIN", "BETA_TESTER"], user.data?.role);

  const [project, setProject] = React.useState<IProjectCreatePayload>({
    name: "",
    description: "",
    isPrivate: true,
  });

  // MUTATION
  const { mutateAsync: createProject, isPending: creatingProject } =
    useMutation({
      mutationKey: [API_ROUTES.PROJECTS.CURRENT_USER_PROJECTS],
      mutationFn: createProjectRequest,
      onSuccess: async (data) => {
        // invalidate projects
        await queryClient.invalidateQueries({
          queryKey: [API_ROUTES.PROJECTS.CURRENT_USER_PROJECTS],
        });
        // @todo - navigate to newly created project
        router.push(`/p/${data}`);
        // close modal
        closeModal();
      },
    });

  const handleProjectCreate = () => {
    if (!project.name) {
      toast.error("Please provide project name");
      return;
    }
    const createProjectPromise = createProject(project);
    toast.promise(createProjectPromise, {
      loading: "Creating project...",
      success: "Project created successfully",
      error: (err) => err.message,
    });
  };

  const toggleProjectVisibility = () => {
    setProject((prevState) => ({
      ...prevState,
      isPrivate: !prevState.isPrivate,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <Button
        onClick={openModal}
        className={cn("mt-3 p-3 rounded-xl w-full font-semibold", className, {
          "p-1": iconOnly,
        })}
        variant="outline"
        leftIcon={<PlusIcon />}
      >
        {iconOnly ? "" : "New Project"}
      </Button>
      <DialogContent>
        <DialogTitle>Create Project</DialogTitle>
        <div className="flex flex-col gap-3">
          <Input
            value={project.name}
            name="name"
            placeholder="Project name"
            onChange={(e) =>
              setProject((prevState) => ({
                ...prevState,
                name: e.target.value,
              }))
            }
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleProjectCreate();
              }
            }}
          />
          <Textarea
            value={project.description}
            name="description"
            placeholder="Project description"
            onChange={(e) =>
              setProject((prevState) => ({
                ...prevState,
                description: e.target.value,
              }))
            }
          />
        </div>
        {isPro ? (
          <div className="p-3">
            <h4 className="text-base font-medium mb-3">Project Visibility</h4>
            {/* Visibility Switch */}
            <div className="flex items-center gap-2 ">
              <span
                className={cn("text-sm", {
                  "font-semibold": !project.isPrivate,
                })}
              >
                Public
              </span>
              <Switch
                defaultChecked={project.isPrivate}
                onCheckedChange={toggleProjectVisibility}
                className="data-[state=checked]:bg-primary-default focus-visible:ring-primary-default"
              />
              <span
                className={cn("text-sm", {
                  "font-semibold": project.isPrivate,
                })}
              >
                Private
              </span>
            </div>
          </div>
        ) : null}
        <Button
          disabled={creatingProject}
          onClick={handleProjectCreate}
          className="mt-4"
        >
          Create Project
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewProject;
