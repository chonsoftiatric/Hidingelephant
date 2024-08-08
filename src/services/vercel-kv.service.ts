import { fetchKvStore } from "@/lib/vercel-kv";
import { IVercelKVKey, KV_KEYS } from "@/types/vercel-kv";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const key = KV_KEYS["kv-model-settings"];
const modelSettingsRequest = async (key: IVercelKVKey) => {
  try {
    const settings = await fetchKvStore(key);
    if (settings?.key === "kv-model-settings") {
      return settings.value;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
  return null;
};

export const useModelSettings = () => {
  const session = useSession();
  const id = session.data?.user.id || "unauthenticated";
  const queryKey = [key, String(id)];

  return useQuery({
    queryKey: queryKey,
    queryFn: () => modelSettingsRequest(key),
    staleTime: 60 * 60 * 1000,
    enabled: session.status === "authenticated",
    refetchOnWindowFocus: false,
  });
};
