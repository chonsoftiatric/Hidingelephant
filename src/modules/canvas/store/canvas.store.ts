import { create } from "zustand";
import { CanvasStoreType, CanvasToolsEnum } from "../types/canvas.types";

export const useCanvasStore = create<CanvasStoreType>((set) => ({
  unsavedChanges: false,
  setUnsavedChanges: (val: boolean) => set({ unsavedChanges: val }),
  selectedTool: CanvasToolsEnum.SELECT,
  setSelectedTool: (val: CanvasToolsEnum) => set({ selectedTool: val }),
}));
