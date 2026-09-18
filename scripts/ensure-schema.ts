import { createClient } from "@libsql/client";
import { ensureGuideSchema } from "../src/db/ensureSchema";

function tursoCredentials() {
  const url = process.env.TURSO_DATABASE_URL ?? process.env.TURSO_DABASE_URL;
  const authToken =
    process.env.TURSO_DATABASE_TOKEN ?? process.env.TURSO_DABASE_TOKEN;
  if (!url || !authToken) {
    return null;
  }
  return { url, authToken };
}

async function main() {
  const credentials = tursoCredentials();
  if (!credentials) {
    if (process.env.VERCEL_ENV === "production") {
      throw new Error("Faltan TURSO_DATABASE_URL y TURSO_DATABASE_TOKEN");
    }
    console.warn("skip schema migrate: no Turso credentials");
    return;
  }

  const client = createClient(credentials);
  try {
    const result = await ensureGuideSchema(client);
    console.log(
      `schema ok: patches=${result.applied.join(",") || "none"}; backfill agreements=${result.backfill.agreements} zone_agreements=${result.backfill.zoneAgreements}`,
    );
  } finally {
    client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
