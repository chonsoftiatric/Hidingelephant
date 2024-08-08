import { z } from "zod";

const creditAmount = z.union([z.literal(100), z.literal(50)]);
export type CreditToBuyAmount = z.infer<typeof creditAmount>;
export const buyMoreCreditPaymentIntentInput = z.object({
  amount: z.union([z.literal(100), z.literal(50)]),
});
export type BuyMoreCreditPaymentIntentInput = z.infer<
  typeof buyMoreCreditPaymentIntentInput
>;
