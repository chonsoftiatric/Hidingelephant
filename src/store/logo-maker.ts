import { ILogoMakerStore } from "@/types/logo-maker";
import { create } from "zustand";

export const useLogoMakerStore = create<ILogoMakerStore>((set) => ({
  activeItem: undefined,
  setActiveItem: (val) => set({ activeItem: val }),
}));
