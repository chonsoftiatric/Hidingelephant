import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/lib/db/schema";

const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

const db = drizzle(poolConnection, {
  schema,
  mode: process.env.APP_ENVIRONMENT === "local" ? "default" : "planetscale",
});

export type DbClient = typeof db;
export { db, db as queryDB };
