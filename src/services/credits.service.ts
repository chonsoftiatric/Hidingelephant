import { addMoreCredit } from "@/actions/credit/addMoreCredit";
import { buyMoreCredit } from "@/actions/credit/buyMoreCredit";
import { CreditToBuyAmount } from "@/schemas/payment.schema";
import { BuyMoreCreditPaymentIntentResponse } from "@/types/payment.types";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// buy more credit -

const buyMoreCreditPaymentIntentRequest = async (amount: CreditToBuyAmount) => {
  return await buyMoreCredit({ amount });
};
export const useBuyMoreCreditIntent = () => {
  return useMutation({
    mutationKey: ["buy-more-credit"],
    mutationFn: buyMoreCreditPaymentIntentRequest,
  });
};

const updateBoughtCreditRequest = async (intentId: string) => {
  return await addMoreCredit({ paymentIntentId: intentId });
};

export const useUpdateBoughtCredit = () => {
  return useMutation({
    mutationKey: ["update-bought-credit"],
    mutationFn: updateBoughtCreditRequest,
  });
};
