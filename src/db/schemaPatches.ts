export type SchemaPatch = {
  id: string;
  statements: string[];
};

export type AgreementRow = {
  id: string;
  title: string;
  description: string;
  classic: string | null;
  icon: string | null;
};

export type ZoneAgreementRow = {
  id: string;
  zoneId: string;
  agreementId: string;
  level: string;
  position: number;
  comment: string | null;
};

export const SCHEMA_PATCHES: SchemaPatch[] = [
  {
    id: "001_agreements",
    statements: [
      `CREATE TABLE IF NOT EXISTS \`schema_patches\` (
        \`id\` text PRIMARY KEY NOT NULL,
        \`applied_at\` integer NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS \`agreements\` (
        \`id\` text PRIMARY KEY NOT NULL,
        \`title\` text NOT NULL,
        \`description\` text NOT NULL,
        \`classic\` text,
        \`icon\` text
      )`,
      `CREATE TABLE IF NOT EXISTS \`zone_agreements\` (
        \`id\` text PRIMARY KEY NOT NULL,
        \`zone_id\` text NOT NULL,
        \`agreement_id\` text NOT NULL,
        \`level\` text NOT NULL,
        \`position\` integer DEFAULT 0 NOT NULL,
        \`comment\` text,
        FOREIGN KEY (\`zone_id\`) REFERENCES \`zones\`(\`id\`) ON DELETE cascade,
        FOREIGN KEY (\`agreement_id\`) REFERENCES \`agreements\`(\`id\`) ON DELETE cascade
      )`,
      `CREATE INDEX IF NOT EXISTS \`zone_agreements_zone_idx\` ON \`zone_agreements\` (\`zone_id\`)`,
      `CREATE INDEX IF NOT EXISTS \`zone_agreements_agreement_idx\` ON \`zone_agreements\` (\`agreement_id\`)`,
    ],
  },
];

export function isMissingSqliteTable(error: unknown, table: string): boolean {
  const message = error instanceof Error ? error.message : String(error);
  const escaped = table.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`no such table:\\s*[\`"']?${escaped}[\`"']?\\s*$`, "i").test(
    message,
  );
}

export function agreementBackfill(
  seed: { agreements: AgreementRow[]; zoneAgreements: ZoneAgreementRow[] },
  existingZoneIds: ReadonlySet<string>,
  agreementsAlreadyPresent: boolean,
): { agreements: AgreementRow[]; zoneAgreements: ZoneAgreementRow[] } {
  if (agreementsAlreadyPresent) {
    return { agreements: [], zoneAgreements: [] };
  }
  const agreementIds = new Set(seed.agreements.map((row) => row.id));
  return {
    agreements: seed.agreements,
    zoneAgreements: seed.zoneAgreements.filter(
      (row) =>
        existingZoneIds.has(row.zoneId) && agreementIds.has(row.agreementId),
    ),
  };
}
