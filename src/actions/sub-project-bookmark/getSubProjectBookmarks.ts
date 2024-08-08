"use server";
import { db } from "@/lib/db";
import { ISubProjectBookmarks } from "@/modules/project/types/api.response.types";
import { authOptions } from "@/utils/next-auth.options";
import { getServerSession } from "next-auth";

// get sub project by id with paginated prompts
export async function getSubProjectBookmarks({
  subProjectId,
}: {
  subProjectId: number;
}) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser) {
    throw new Error("Unauthorized");
  }
  const subProject = await db.query.subProjects.findFirst({
    where: (subProject, { eq }) => eq(subProject.id, +subProjectId),
    with: {
      subProjectBookmarks: {
        with: {
          image: true,
        },
      },
    },
  });
  // check if sub project belong to current session user
  if (subProject?.userId !== sessionUser.id) {
    throw new Error("Not authorized to add bookmark");
  }

  return subProject as unknown as ISubProjectBookmarks;
}
