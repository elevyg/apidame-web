import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

function requiredEnv(name: string, fallbackName?: string): string {
  const value = process.env[name] ?? (fallbackName ? process.env[fallbackName] : undefined);
  if (!value) {
    throw new Error(
      fallbackName
        ? `Missing ${name} (o ${fallbackName})`
        : `Missing ${name}`,
    );
  }
  return value;
}

export function tursoCredentials() {
  return {
    url: requiredEnv("TURSO_DATABASE_URL", "TURSO_DABASE_URL"),
    authToken: requiredEnv("TURSO_DATABASE_TOKEN", "TURSO_DABASE_TOKEN"),
  };
}

const client = createClient(tursoCredentials());

export const db = drizzle(client, { schema });
