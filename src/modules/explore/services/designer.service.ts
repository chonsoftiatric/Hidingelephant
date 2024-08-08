// GET USER FEED [QUERY]
import { IGetDesignerFeed } from "../types/designer.types";
import { IUpdateDesignerProfile } from "../schemas/designer.schema";
import {
  getDesignerDataByUsername,
  updateUserDeginerProfile,
} from "@/actions/user/user";
import { getDesignerFeedData } from "@/actions/feed/feed";

export const getDesignerFeed = async ({ id, offset }: IGetDesignerFeed) => {
  return await getDesignerFeedData({ id, offset });
};

export const getDesigner = async ({ username }: { username: string }) => {
  return await getDesignerDataByUsername(username);
};

export const updateDesignerProfile = async (
  payload: IUpdateDesignerProfile
) => {
  return await updateUserDeginerProfile({ body: payload });
};
