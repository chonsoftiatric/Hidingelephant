import { IFeedQueryStore } from "@/modules/explore/types/explore.types";
import { create } from "zustand";

export const useFeedQueryStore = create<IFeedQueryStore>((set) => ({
  tag: undefined,
  setTag: (val) => set({ tag: val }),
  sortBy: undefined,
  setSortBy: (val) => set({ sortBy: val }),
  username: undefined,
  setUsername: (val) => set({ username: val }),
}));
