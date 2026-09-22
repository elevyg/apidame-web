import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { withDbRetry } from "./retry";

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

function reportRetryExhausted(error: unknown, attempts: number) {
  console.error(
    `Turso request failed after ${attempts} attempts (transient upstream error)`,
    error,
  );
  import("@/lib/posthog-server")
    .then(({ getPostHogServer }) => {
      getPostHogServer()?.capture({
        distinctId: "turso-server",
        event: "db_retry_exhausted",
        properties: { attempts },
      });
    })
    .catch(() => {});
}

/**
 * Wraps `execute` and `batch` so a transient Turso blip (a 502 and similar)
 * is retried with backoff instead of surfacing as a page error. Reads and the
 * atomic `batch` are safe to replay; transactions stay unwrapped.
 */
function withRetryingClient(client: Client): Client {
  return new Proxy(client, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);
      if ((property === "execute" || property === "batch") && typeof value === "function") {
        return (...args: unknown[]) =>
          withDbRetry(() => value.apply(target, args), {
            onExhausted: reportRetryExhausted,
          });
      }
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}

const client = withRetryingClient(createClient(tursoCredentials()));

export const db = drizzle(client, { schema });
