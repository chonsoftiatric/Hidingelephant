import React from "react";
import { useVercelKV } from "@/store/vercel-kv";
import { usePromptStore } from "@/store/prompt-settings";
import { useModelSettings } from "@/services/vercel-kv.service";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data } = useModelSettings();
  const promptState = usePromptStore();
  const { setModelSettings, modelSettings } = useVercelKV();
  const handleVercelKVData = async () => {
    if (data) {
      setModelSettings(data);
      promptState.setElephantBrain(data?.models[0]?.name);
      promptState.setElephantStyle(data?.methods[0]?.name);
    }
  };

  React.useEffect(() => {
    if (data) {
      handleVercelKVData();
    }
  }, [data]);

  return children;
};

export default LayoutWrapper;
