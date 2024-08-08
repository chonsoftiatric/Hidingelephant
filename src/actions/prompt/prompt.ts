"use server";

import { db, queryDB } from "@/lib/db";
import { IRecentPrompts } from "@/modules/project/types/api.response.types";
import { IPrompt, ISubProject } from "@/types/db.schema.types";
import { authOptions } from "@/utils/next-auth.options";
import { getServerSession } from "next-auth";

export const getPromptById = async (id: number) => {
  // Get session
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!sessionUser) {
    throw new Error("Unauthorized");
  }

  if (isNaN(+id)) {
    throw new Error("Invalid ID");
  }

  // Getting prompt by ID
  const prompt = await queryDB.query.prompts.findFirst({
    where: (prompts, { eq }) => eq(prompts.id, id),
    with: {
      images: true,
    },
  });

  return prompt;
};

export const getRecentPromptsFromProjects = async () => {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!sessionUser) {
    throw new Error("Unauthorized");
  }

  const subProjects = (await db.query.subProjects.findMany({
    where: (subProject, { eq }) => eq(subProject.userId, sessionUser.id),
    with: {
      prompts: {
        limit: 1,
        with: { images: true },
        // @ts-ignore
        orderBy: (prompts, { desc }) => desc(prompts.createdAt),
      },
      project: true,
    },
  })) as Array<ISubProject & { prompts: IPrompt[] }>;

  const filterEmptyProjects = subProjects.filter(
    (item) => item?.prompts.length >= 1
  );

  const sortPrompts = filterEmptyProjects.sort((a, b) => {
    if (a.prompts[0]) {
      const aDate = new Date(a.prompts[0].createdAt as string).getTime();
      const bDate = new Date(b.prompts[0].createdAt as string).getTime();
      if (aDate > bDate) return -1;
      else return 1;
    }
    return 1;
  });

  return sortPrompts.slice(0, 6) as unknown as IRecentPrompts[];
};
