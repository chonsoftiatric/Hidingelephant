import { resetCreditInfo } from "@/controllers/credit.controller";
import { db } from "@/lib/db";
import { fetchKvStore } from "@/lib/vercel-kv";
import { ICredit, IDBUser } from "@/types/db.schema.types";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

type ICreditWithUser = ICredit & { user: IDBUser };
export const GET = async (req: NextRequest) => {
  try {
    const credit_arr = (await db.query.credit.findMany({
      with: {
        user: true,
      },
    })) as ICreditWithUser[];
    const stripe_config_data = await fetchKvStore("stripe-plans-settings");
    if (stripe_config_data?.key !== "stripe-plans-settings") {
      return new Response(null, { status: 500 });
    }

    await Promise.all(
      credit_arr.map((credit) =>
        resetCreditInfo({
          credit,
          stripe_config_data: stripe_config_data.value,
        })
      )
    );
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.log(
      `Credit Information Reset CRONJOB Failed - MESSAGE: ${
        (err as Error)?.message
      }`
    );
    return new Response(null, { status: 500 });
  }
};
