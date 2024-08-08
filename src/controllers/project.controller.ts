import { projectSchema } from "@/app/schema/project";
import { db } from "@/lib/db";
import { canvas, projects, subProjects } from "@/lib/db/schema";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";

type ICreateProject = {
  payload: any;
  userId: number;
  isBetaTester: boolean;
};
export const createProject = async ({
  payload,
  userId,
  isBetaTester,
}: ICreateProject): Promise<number> => {
  const subscriptionPlan = await getUserSubscriptionPlan();
  try {
    const body = projectSchema.parse(payload);
    const project = await db.insert(projects).values({
      name: body.name,
      type: body?.type,
      description: body.description,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const subProject = await db.insert(subProjects).values({
      userId: userId,
      name: `sub-project-${body.name}`,
      type: body.type,
      description: body.description,
      projectId: +project[0].insertId,
      visibility:
        subscriptionPlan.isSubscribed || isBetaTester
          ? body.visibility
          : "PUBLIC",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // create the canvas for sub-project
    await db.insert(canvas).values({ subProjectId: subProject[0].insertId });
    return subProject[0].insertId;
  } catch (err) {
    console.log(err);
    throw new Error(
      err instanceof Error ? err.message : "Project creation failed"
    );
  }
};
