import { plan_settings } from "@/data";
import { fetchKvStore } from "@/lib/vercel-kv";
import { useQuery } from "@tanstack/react-query";

export const getFeatureAccessRequest = async () => {
  const data = await fetchKvStore("stripe-plans-access");
  if (data?.key === "stripe-plans-access") {
    return data.value;
  }
  throw new Error("features not found");
};
export const useFeatureAccessConfig = () => {
  return useQuery({
    queryKey: ["feature-access"],
    queryFn: getFeatureAccessRequest,
    staleTime: 60 * 60 * 1000,
    refetchOnReconnect: false,
  });
};

export const getStripePlanSettingsRequest = async () => {
  const data = await fetchKvStore("stripe-plans-settings");
  if (data?.key === "stripe-plans-settings") {
    return data.value;
  }
  throw new Error("features not found");
};
export const useStripePlanSettings = () => {
  return useQuery({
    queryKey: ["stripe-plan-settings"],
    queryFn: getStripePlanSettingsRequest,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
