import {
  createNewProject,
  deleteProjectById,
  getCurrentUserProjects,
  updateProjectById,
} from "@/actions/project/project";
import {
  IProjectCreatePayload,
  IProject,
  IProjectUpdateParams,
  ICurrentUserProjectsList,
} from "@/types/project.types";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// CREATE PROJECT [MUTATION]
export const createProjectRequest = async (payload: IProjectCreatePayload) => {
  return await createNewProject({ payload });
};

// GET CURRENT USER'S PROJECTS [QUERY]
export const getCurrentUserProjectsRequest = async () => {
  return await getCurrentUserProjects();
};

export const useMyProjects = () => {
  return useQuery({
    queryKey: [API_ROUTES.PROJECTS.CURRENT_USER_PROJECTS],
    queryFn: getCurrentUserProjectsRequest,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000 * 1000,
    retry: 1,
  });
};

// UPDATE PROJECT [MUTATION]
export const updateProjectRequest = async ({
  id,
  payload,
}: IProjectUpdateParams) => {
  return await updateProjectById({
    id: +id,
    body: payload,
  });
};

// DELETE PROJECT [MUTATION]
export const deleteProjectRequest = async (id: string) => {
  return await deleteProjectById(id);
};
