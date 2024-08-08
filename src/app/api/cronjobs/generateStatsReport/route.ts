import { db } from "@/lib/db";
import { reports, vectorize_images } from "@/lib/db/schema";
import { CreditFeature } from "@/schemas/global.schema";
import { reportInitialItem, ReportItem } from "@/schemas/report.schema";
import { IDBUser } from "@/types/db.schema.types";
import format from "date-fns/format";
import { count, eq, gte } from "drizzle-orm";

export async function GET() {
  const current = new Date();
  const start = new Date();
  start.setHours(0, 0, 0, 0); // 12 am

  const date = format(current, "yyyy-MM-dd");

  console.log(`GENERATING CREDIT USAGE STATS REPORT FOR ${date}`);

  const previousRecord = await db.query.reports.findFirst({
    where: (reports, { and, gte, lte }) =>
      and(gte(reports.createdAt, start), lte(reports.createdAt, current)),
  });
  const previousRecordItem = previousRecord?.report;

  const usersToday = await db.query.users.findMany({
    where: (users, { gte }) => gte(users.createdAt, start),
  });
  console.log(`FOUND ${usersToday.length} USERS`);
  const vectorizedImageCountData = await db
    .select({ count: count() })
    .from(vectorize_images)
    .where(gte(vectorize_images.createdAt, start.toISOString()));
  const vectorizedImageCount = vectorizedImageCountData[0].count;
  console.log(`FOUND ${vectorizedImageCount} VECTORIZED IMAGES`);

  const usersCount: Record<IDBUser["plan"], number> = {
    FREE: 0,
    PLUS: 0,
    PRO: 0,
    EARLY_BIRD: 0,
  };
  for (const user of usersToday) {
    usersCount[user.plan]++;
  }

  const usageItems = await db.query.creditsUsed.findMany({
    where: (creditsUsed, { gte, lte, and }) =>
      and(
        gte(creditsUsed.createdAt, start),
        lte(creditsUsed.createdAt, current)
      ),
  });

  console.log(`FOUND ${usageItems.length} CREDIT USAGE ITEMS`);

  const initialReport = { ...reportInitialItem };
  for (const item of usageItems) {
    const {
      creditsUsed,
      elephantBrain,
      generationType,
      elephantStyle,
      plan,
      feature,
    } = item;

    // User Plan Based Report Data
    initialReport.user[plan] = {
      creditsUsed: initialReport.user[plan].creditsUsed + creditsUsed,
      total: usersCount[plan],
    };

    // Model Selector Based Report Data
    const brain = elephantBrain as keyof ReportItem["modelSelector"] | null;
    if (brain && initialReport.modelSelector[brain]) {
      initialReport.modelSelector[brain].count += 1;
      initialReport.modelSelector[brain].creditsUsed =
        initialReport.modelSelector[brain].creditsUsed + creditsUsed;
    }

    const styleSelectorMapping: Record<string, string> = {
      "Euler a": "standardElephant",
      DDIM: "creativeElephant",
      "DPM++ 2S a Karras": "crazyElephant",
      "LMS Karras": "wildElephant",
    };
    // Style Selector Based Report Data
    const styleSelector = elephantStyle
      ? styleSelectorMapping[elephantStyle]
      : null;
    const style = styleSelector as keyof ReportItem["styleSelector"] | null;
    if (style && initialReport.styleSelector[style]) {
      initialReport.styleSelector[style].count += 1;
      initialReport.styleSelector[style].creditsUsed =
        initialReport.styleSelector[style].creditsUsed + creditsUsed;
    }

    // Generation Feature Based Report Data
    const genFeature = generationType as
      | keyof ReportItem["generationFeature"]
      | null;
    if (genFeature && initialReport.generationFeature[genFeature]) {
      initialReport.generationFeature[genFeature].count += 1;
      initialReport.generationFeature[genFeature].creditsUsed =
        initialReport.generationFeature[genFeature].creditsUsed + creditsUsed;
    }

    initialReport.totalCreditsUsed += creditsUsed;
  }
  initialReport.features.VECTORIZE.count = vectorizedImageCount;

  console.log(`GENERATED CREDIT USAGE STATS REPORT FOR ${date}`);

  if (previousRecordItem) {
    await db
      .update(reports)
      .set({
        report: initialReport,
      })
      .where(eq(reports.id, previousRecord.id));
  } else {
    // create report record
    await db.insert(reports).values({
      report: initialReport,
    });
  }

  return new Response("OK");
}
