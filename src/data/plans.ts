import { STRIPE_PRICE_IDS } from "./stripe";

export const PLANS = [
  {
    name: "Free",
    price: {
      month: {
        amount: 0,
        priceIds: {
          test: "free",
          production: "free",
        },
      },
      year: {
        amount: 0,
        priceIds: {
          test: "free_test_year_price_id",
          production: "free_prod_year_price_id",
        },
      },
    },
  },
  {
    name: "Plus",
    price: {
      month: {
        amount: 20,
        priceIds: {
          test: STRIPE_PRICE_IDS.PLUS.test.month,
          production: "free_prod_month_price_id",
        },
      },
      year: {
        amount: 200,
        priceIds: {
          test: STRIPE_PRICE_IDS.PLUS.test.year,
          production: "plus_prod_year_price_id",
        },
      },
    },
  },
  {
    name: "Pro",
    price: {
      month: {
        amount: 9,
        priceIds: {
          test: STRIPE_PRICE_IDS.PRO.test.month,
          production: "pro_prod_month_price_id",
        },
      },
      year: {
        amount: 90,
        priceIds: {
          test: STRIPE_PRICE_IDS.PRO.test.year,
          production: "pro_prod_year_price_id",
        },
      },
    },
  },
  {
    name: "Early Bird",
    price: {
      month: {
        amount: 5,
        priceIds: {
          test: STRIPE_PRICE_IDS.EARLY_BIRD.test.month,
          production: "early_bird_prod_month_price_id",
        },
      },
      year: {
        amount: 50,
        priceIds: {
          test: STRIPE_PRICE_IDS.EARLY_BIRD.test.year,
          production: "early_bird_prod_year_price_id",
        },
      },
    },
  },
  {
    name: "Beta Tester",
    price: {
      month: {
        amount: 10,
        priceIds: {
          test: "beta_tester",
          production: "beta_tester",
        },
      },
      year: {
        amount: 100,
        priceIds: {
          test: "beta_tester",
          production: "beta_tester",
        },
      },
    },
  },
];
