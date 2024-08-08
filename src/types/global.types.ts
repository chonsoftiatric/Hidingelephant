import { CreditToBuyAmount } from "@/schemas/payment.schema";
import { IProjectPrompt } from "@/modules/project/types/common.types";

export type IModalType =
  | "upgrade-subscription"
  | "subscribe"
  | "buy-more-credit"
  | "other-modal";
export type IVectorizeModal = {
  open: boolean;
  id: number | undefined;
  imageUrl: string;
  saveKey: string;
  animateIcon?: boolean;
  subProjectId: string | number | undefined;
};

export type IActiveImage = {
  id: string;
  imageUrl: string;
  cb?: (prompt?: IProjectPrompt) => void;
};
type IGenerateSimilarImageActive = IActiveImage & {
  subProjectId: number;
};

export type IGlobalStore = {
  activeModal: IModalType | undefined;
  setActiveModal: (p: IModalType | undefined) => void;
  activeSubProject: number | undefined;
  setActiveSubProject: (p: number | undefined) => void;
  vectorizeModal: IVectorizeModal;
  updateVectorizeModal: (p: IVectorizeModal) => void;
  updateSaveIconAnimation: (p: boolean) => void;
  editImageModal: IActiveImage | undefined;
  updateEditImageModal: (p: IActiveImage | undefined) => void;
  bookmarkPopoverOpen: boolean;
  setBookmarkPopoverOpen: (p: boolean) => void;
  generateSimilarImage: IGenerateSimilarImageActive | undefined;
  setGenerateSimilarImage: (p: IGenerateSimilarImageActive | undefined) => void;
  sketchImageDialogSubProjectId: number | undefined;
  setSketchImageDialogSubProjectId: (p: number | undefined) => void;
  creditsToBuy: CreditToBuyAmount | undefined;
  setCreditsToBuy: (p: CreditToBuyAmount | undefined) => void;
  creditsThankYou: boolean;
  setCreditsThankYou: (p: boolean) => void;
};

export type IApplication = "APP" | "ADMIN_PANEL" | "DOCUMENTATION";
export type IApplicationAccessConfig = {
  user: string;
  access: IApplication[];
};

export type IOnBoarding = {
  username: string;
  profileImage: string;
  sourceReference: string;
  teamSize: string;
  workRole: string[];
  primaryUsage: string[];
};
