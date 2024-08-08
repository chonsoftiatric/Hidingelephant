"use server";

import { createProject } from "@/controllers/project.controller";
import { db, queryDB } from "@/lib/db";
import { projects, subProjects } from "@/lib/db/schema";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import {
  ICurrentUserProjectsList,
  IProjectCreatePayload,
  IProjectUpdatePayload,
} from "@/types/project.types";
import { authOptions } from "@/utils/next-auth.options";
import { and, asc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

// Update project visibility action
export const updateProjectVisibility = async (
  projectId: number,
  visibility: "PUBLIC" | "PRIVATE"
) => {
  const subscriptionPlan = await getUserSubscriptionPlan();
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Please login to update visibility");
  }
  const dbUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, session.user.id),
  });
  if (!dbUser) {
    throw new Error("Please login to update visibility");
  }
  const isBetaTester = dbUser.role === "BETA_TESTER";
  const project = await db.query.projects.findFirst({
    where: (projects, { eq }) => eq(projects.id, projectId),
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (project.userId !== dbUser.id) {
    throw new Error("You are not allowed to update visibility");
  }

  // If user is not a beta tester and user is not on pro plan and visibility updation is private, don't update visibility
  if (
    !isBetaTester &&
    subscriptionPlan.isSubscribed === false &&
    visibility === "PRIVATE"
  ) {
    throw new Error("Only pro users can update project visibility");
  }

  await db
    .update(subProjects)
    .set({ visibility: visibility })
    .where(eq(subProjects.id, projectId));

  return visibility;
};

export const createNewProject = async ({
  payload,
}: {
  payload: IProjectCreatePayload;
}) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("Unauthorized");
  }
  const dbUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, sessionUser.id),
  });
  if (!dbUser) throw new Error("Unauthorized");
  const isBetaTester = dbUser.role === "BETA_TESTER";
  const subProjectId = await createProject({
    payload,
    userId: sessionUser.id,
    isBetaTester,
  });
  // @temp - sending back the subProject ID
  return subProjectId;
};

export const getCurrentUserProjects = async () => {
  // Get session
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!sessionUser) {
    throw new Error("Unauthorized");
  }

  const allProjects = await queryDB.query.projects.findMany({
    where: (projects, { eq }) => eq(projects.userId, sessionUser.id),
    orderBy: asc(projects.id),
    columns: {
      id: true,
      name: true,
      type: true,
    },
    with: {
      subProjects: {
        with: {
          canvas: true,
        },
      },
    },
  });

  return allProjects as unknown as ICurrentUserProjectsList[];
};

export const updateProjectById = async ({
  id,
  body,
}: {
  id: number;
  body: IProjectUpdatePayload;
}) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    return new Response(null, { status: 401 });
  }

  if (isNaN(+id)) {
    return new Response(null, { status: 400 });
  }

  const project = await db
    .update(projects)
    .set({
      name: body.name,
      description: body.description || "",
      updatedAt: new Date(),
    })
    .where(
      and(eq(projects.id, Number(id)), eq(projects.userId, session.user.id))
    );
  return "Updated successfully";
};

export const deleteProjectById = async (id: string) => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("Unauthorized");
  }

  if (isNaN(+id)) {
    throw new Error("Invalid project ID");
  }
  const project = await db.query.projects.findFirst({
    where: (projects, { eq }) => eq(projects.id, Number(id)),
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (project.userId !== sessionUser.id) {
    throw new Error("You are not allowed to delete this project");
  }
  if (project.type === "PLAYGROUND") {
    throw new Error("You cannot delete a playground");
  }

  await db
    .delete(projects)
    .where(
      and(eq(projects.id, Number(id)), eq(projects.userId, sessionUser.id))
    );
  return "Project deleted successfully";
};
