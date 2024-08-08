import { STRIPE_PRICE_IDS } from "@/data/stripe";
import { IAccess } from "@/types/feature.types";
import { IPlan } from "@/types/user.types";

export const index_to_feature: Record<number, IAccess> = {
  0: "Free",
  1: "Plus",
  2: "Pro",
  3: "Early Bird",
  4: "Beta Tester",
};

export const feature_to_index: Record<IAccess, number> = {
  Free: 0,
  Plus: 1,
  Pro: 2,
  "Early Bird": 3,
  "Beta Tester": 4,
};

export const plan_to_index: Record<IPlan | "BETA_TESTER", number> = {
  FREE: 0,
  PLUS: 1,
  PRO: 2,
  EARLY_BIRD: 3,
  BETA_TESTER: 4,
};

export const price_id_plans: { priceId: string; plan: IPlan }[] = [
  {
    priceId: STRIPE_PRICE_IDS.PLUS.test.month,
    plan: "PLUS",
  },
  {
    priceId: STRIPE_PRICE_IDS.PLUS.test.year,
    plan: "PLUS",
  },
  {
    priceId: STRIPE_PRICE_IDS.PRO.test.month,
    plan: "PRO",
  },
  {
    priceId: STRIPE_PRICE_IDS.PRO.test.year,
    plan: "PRO",
  },
  {
    priceId: STRIPE_PRICE_IDS.EARLY_BIRD.test.month,
    plan: "EARLY_BIRD",
  },
  {
    priceId: STRIPE_PRICE_IDS.EARLY_BIRD.test.year,
    plan: "EARLY_BIRD",
  },
];
