import { IGlobalStore, IVectorizeModal } from "@/types/global.types";
import { create } from "zustand";

export const initialVectorizedModalState: IVectorizeModal = {
  open: false,
  imageUrl: "",
  id: undefined,
  saveKey: "",
  animateIcon: false, // trigger for animating vectorize tab icon
  subProjectId: undefined,
};

export const useGlobalStore = create<IGlobalStore>((set) => ({
  bookmarkPopoverOpen: false,
  setBookmarkPopoverOpen: (p) => set({ bookmarkPopoverOpen: p }),
  activeModal: undefined,
  setActiveModal: (p) => set({ activeModal: p, creditsToBuy: undefined }),
  activeSubProject: undefined,
  setActiveSubProject: (p) => set({ activeSubProject: p }),
  vectorizeModal: initialVectorizedModalState,
  updateVectorizeModal: (p: IVectorizeModal) => set({ vectorizeModal: p }),
  updateSaveIconAnimation: (p) =>
    set((state) => ({
      vectorizeModal: { ...state.vectorizeModal, animateIcon: p },
    })), // update vectorize animation trigger state,
  editImageModal: undefined,
  updateEditImageModal: (p) => set((state) => ({ editImageModal: p })),
  generateSimilarImage: undefined,
  setGenerateSimilarImage: (p) => set({ generateSimilarImage: p }),
  sketchImageDialogSubProjectId: undefined,
  setSketchImageDialogSubProjectId: (p) =>
    set({ sketchImageDialogSubProjectId: p }),
  creditsToBuy: undefined,
  setCreditsToBuy: (p) => set({ creditsToBuy: p }),
  creditsThankYou: false,
  setCreditsThankYou: (p) => set({ creditsThankYou: p }),
}));
