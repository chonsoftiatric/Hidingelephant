"use server";
import { db } from "@/lib/db";
import { subProjectBookmarks } from "@/lib/db/schema";
import { ISubProjectBookmark, Image } from "@/types/db.schema.types";
import { authOptions } from "@/utils/next-auth.options";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export type Props = { subProjectId: number; imageId: number };

// get sub project by id with paginated prompts
export async function toggleImageBookmark({ subProjectId, imageId }: Props) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    if (!sessionUser) {
      throw new Error("Unauthenticated");
    }
    const subProject = await db.query.subProjects.findFirst({
      where: (subProject, { eq }) => eq(subProject.id, +subProjectId),
    });
    // check if sub project belong to current session user
    if (subProject?.userId !== sessionUser.id) {
      throw new Error("Not authorized to add bookmark");
    }
    const image = (await db.query.images.findFirst({
      where: (images, { eq }) => eq(images.id, +imageId),
      with: {
        subProjectBookmark: true,
      },
    })) as Image & { subProjectBookmark: ISubProjectBookmark | undefined };

    // check if image belong to current session user
    if (image?.userId !== sessionUser.id) {
      throw new Error("Not authorized to add bookmark");
    }
    // if bookmark already exists - remove the bookmark - else add the bookmark
    if (image.subProjectBookmark) {
      // remove the bookmark
      await db
        .delete(subProjectBookmarks)
        .where(eq(subProjectBookmarks.id, image.subProjectBookmark.id));
      return null;
    }

    // add the bookmark
    const bookmark = await db.insert(subProjectBookmarks).values({
      //@ts-ignore
      userId: sessionUser.id,
      subProjectId,
      imageId,
      promptId: image.promptId,
    });
    const bookmarkWithImage = await db.query.subProjectBookmarks.findFirst({
      where: (subProjectBookmarks, { eq }) =>
        eq(subProjectBookmarks.id, bookmark[0].insertId),
      with: {
        image: true,
      },
    });

    if (!bookmarkWithImage) {
      throw new Error("Bookmark not found");
    }
    return bookmarkWithImage;
  } catch (err) {
    throw err;
  }
}
