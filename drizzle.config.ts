import { existsSync } from "node:fs";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

if (existsSync(".env.local")) {
  config({ path: ".env.local" });
}

const url = process.env.TURSO_DATABASE_URL ?? process.env.TURSO_DABASE_URL;
const authToken =
  process.env.TURSO_DATABASE_TOKEN ?? process.env.TURSO_DABASE_TOKEN;

if (!url || !authToken) {
  throw new Error("Faltan TURSO_DATABASE_URL y TURSO_DATABASE_TOKEN");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: { url, authToken },
});
