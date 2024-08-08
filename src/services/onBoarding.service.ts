import {
  getUserOnBoardingDetails,
  onboardUser,
} from "@/actions/onboarding/onboarding";
import { uploadImageToR2 } from "@/actions/uploads/image";
import { IOnBoarding } from "@/types/global.types";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

export const userOnBoarding = async (body: Partial<IOnBoarding>) => {
  return await onboardUser({ data: body });
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return await uploadImageToR2({ data: formData });
};

export const getUserOnBoardingDetailsByID = async () => {
  return await getUserOnBoardingDetails();
};

export const useOnBoardingDetails = () => {
  return useQuery({
    queryKey: ["on-boarding-details"],
    queryFn: () => getUserOnBoardingDetailsByID(),
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
};
