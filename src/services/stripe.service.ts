import {
  createStripeSubscriptionSession,
  getUserStripeSubscriptionPlan,
} from "@/actions/stripe/stripe";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const createStripeSession = async (
  payload: ICreateStripeSessionPayload
) => {
  return await createStripeSubscriptionSession({
    plan_name: payload.plan_name,
    plan_duration: payload.plan_duration,
  });
};

const getPlanDetails = async () => {
  return await getUserStripeSubscriptionPlan();
};

export const usePlanDetails = () => {
  return useQuery({
    queryKey: ["subscription-details"],
    queryFn: getPlanDetails,
    staleTime: 5 * 60 * 60,
    refetchOnWindowFocus: false,
  });
};
