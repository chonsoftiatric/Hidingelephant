import { IVercelKVStore } from "@/types/vercel-kv";
import { create } from "zustand";

export const useVercelKV = create<IVercelKVStore>((set) => ({
  modelSettings: undefined,
  setModelSettings: (val) => set({ modelSettings: val }),
}));
