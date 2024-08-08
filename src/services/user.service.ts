import { getUserCreditDetails } from "@/actions/credit/credit";
import { getUserDesignerStats } from "@/actions/global";
import { getRecentPromptsFromProjects } from "@/actions/prompt/prompt";
import { getUserStripeSubscriptionPlan } from "@/actions/stripe/stripe";
import {
  getCurrentUserReferralInfo,
  getUserDetailsById,
  updateUserProfileDetails,
} from "@/actions/user/user";
import { ICredit } from "@/types/db.schema.types";
import {
  ISessionUser,
  IUserStat,
  UserReferralInfoResponse,
} from "@/types/user.types";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

const getUserByIdRequest = async (id: number) => {
  return await getUserDetailsById(id);
};
export const useUserDetails = () => {
  const { data } = useSession();
  const userId = data?.user.id as number;
  const key = API_ROUTES.USER.GET_BY_ID(userId);

  return useQuery({
    queryKey: [key],
    queryFn: () => getUserByIdRequest(userId),
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
    enabled: typeof userId === "number",
  });
};

const getUserCredit = async () => {
  return await getUserCreditDetails();
};

export const useCreditDetails = () => {
  const key = API_ROUTES.USER.GET_CREDIT;
  return useQuery({
    queryKey: [key],
    queryFn: getUserCredit,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
  });
};

const getRecentPrompts = async () => {
  return await getRecentPromptsFromProjects();
};

export const useGetLastPrompts = () => {
  return useQuery({
    queryKey: [API_ROUTES.PROMPTS.GET_RECENT_PROMPTS],
    queryFn: getRecentPrompts,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
  });
};

const getUserStats = async () => {
  return await getUserDesignerStats();
};

export const useGetUserStats = () => {
  return useQuery({
    queryKey: [API_ROUTES.USER.GET_STATS],
    queryFn: getUserStats,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
    refetchOnMount: false,
  });
};

export type IUpdateUserDetails = {
  firstName: string;
  lastName: string;
  profileImage: string;
};

export const updateUserDetails = async (data: IUpdateUserDetails) => {
  return await updateUserProfileDetails(data);
};

const userReferralInfoRequest = async () => {
  return await getCurrentUserReferralInfo();
};
export const useUserReferralInfo = () => {
  return useQuery({
    queryKey: ["user-referral-info"],
    queryFn: userReferralInfoRequest,
  });
};

const getSubscriptionDetails = async () => {
  return await getUserStripeSubscriptionPlan();
};

export const useSubscription = () => {
  const session = useSession();
  const sessionUser = session.data?.user as ISessionUser;
  const isAuthenticated = Boolean(sessionUser);
  return useQuery({
    queryKey: ["subscription-details"],
    queryFn: getSubscriptionDetails,
    enabled: isAuthenticated,
  });
};
