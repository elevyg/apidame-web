import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Client } from "@libsql/client";
import {
  SCHEMA_PATCHES,
  agreementBackfill,
  type AgreementRow,
  type ZoneAgreementRow,
} from "./schemaPatches";

type GuideSeedFile = {
  agreements?: Array<Partial<AgreementRow> & { id?: unknown }>;
  zoneAgreements?: Array<Partial<ZoneAgreementRow> & { id?: unknown }>;
};

function asString(value: unknown): string {
  return String(value ?? "");
}

function asNullableString(value: unknown): string | null {
  return value == null ? null : String(value);
}

function seedFromFile(path = resolve("scripts/seed/deportiva.json")): {
  agreements: AgreementRow[];
  zoneAgreements: ZoneAgreementRow[];
} {
  const raw = JSON.parse(readFileSync(path, "utf8")) as GuideSeedFile;
  const agreements: AgreementRow[] = (raw.agreements ?? [])
    .map((row) => ({
      id: asString(row.id),
      title: asString(row.title),
      description: asString(row.description),
      classic: asNullableString(row.classic),
      icon: asNullableString(row.icon),
    }))
    .filter((row) => row.id.length > 0);
  const zoneAgreements: ZoneAgreementRow[] = (raw.zoneAgreements ?? [])
    .map((row) => ({
      id: asString(row.id),
      zoneId: asString(row.zoneId),
      agreementId: asString(row.agreementId),
      level: asString(row.level),
      position: Number(row.position ?? 0),
      comment: asNullableString(row.comment),
    }))
    .filter(
      (row) =>
        row.id.length > 0 &&
        row.zoneId.length > 0 &&
        row.agreementId.length > 0 &&
        row.level !== "NotAplicable",
    );
  return { agreements, zoneAgreements };
}

async function columnValues(client: Client, sql: string): Promise<string[]> {
  const result = await client.execute(sql);
  return result.rows.map((row) => String(row[0]));
}

async function applyPatch(client: Client, patchId: string, statements: string[]) {
  const applied = await client.execute({
    sql: "SELECT id FROM schema_patches WHERE id = ?",
    args: [patchId],
  });
  if (applied.rows.length > 0) return false;

  for (const sql of statements) {
    await client.execute(sql);
  }
  await client.execute({
    sql: "INSERT INTO schema_patches (id, applied_at) VALUES (?, ?)",
    args: [patchId, Date.now()],
  });
  return true;
}

async function backfillAgreements(client: Client) {
  const existing = await columnValues(client, "SELECT id FROM agreements LIMIT 1");
  const zoneIds = new Set(await columnValues(client, "SELECT id FROM zones"));
  const planned = agreementBackfill(seedFromFile(), zoneIds, existing.length > 0);
  if (planned.agreements.length === 0 && planned.zoneAgreements.length === 0) {
    return { agreements: 0, zoneAgreements: 0 };
  }

  for (const row of planned.agreements) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO agreements (id, title, description, classic, icon)
            VALUES (?, ?, ?, ?, ?)`,
      args: [row.id, row.title, row.description, row.classic, row.icon],
    });
  }
  for (const row of planned.zoneAgreements) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO zone_agreements
            (id, zone_id, agreement_id, level, position, comment)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        row.id,
        row.zoneId,
        row.agreementId,
        row.level,
        row.position,
        row.comment,
      ],
    });
  }
  return {
    agreements: planned.agreements.length,
    zoneAgreements: planned.zoneAgreements.length,
  };
}

export async function ensureGuideSchema(client: Client) {
  await client.execute(`CREATE TABLE IF NOT EXISTS \`schema_patches\` (
    \`id\` text PRIMARY KEY NOT NULL,
    \`applied_at\` integer NOT NULL
  )`);

  const applied: string[] = [];
  for (const patch of SCHEMA_PATCHES) {
    if (await applyPatch(client, patch.id, patch.statements)) {
      applied.push(patch.id);
    }
  }
  const backfill = await backfillAgreements(client);
  return { applied, backfill };
}
