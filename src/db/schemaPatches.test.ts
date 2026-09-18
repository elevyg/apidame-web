import { describe, expect, it } from "vitest";
import {
  SCHEMA_PATCHES,
  agreementBackfill,
  isMissingSqliteTable,
} from "./schemaPatches";

describe("SCHEMA_PATCHES", () => {
  it("has unique ids and only additive DDL", () => {
    const ids = SCHEMA_PATCHES.map((patch) => patch.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const patch of SCHEMA_PATCHES) {
      expect(patch.statements.length).toBeGreaterThan(0);
      for (const sql of patch.statements) {
        expect(sql).toMatch(
          /^(CREATE TABLE IF NOT EXISTS|CREATE INDEX IF NOT EXISTS)/,
        );
        expect(sql).not.toMatch(/\bDROP TABLE\b/i);
        expect(sql).not.toMatch(/\bDELETE FROM\b/i);
      }
    }
  });

  it("creates the agreement tables that take down the zone page", () => {
    const sql = SCHEMA_PATCHES.flatMap((patch) => patch.statements).join("\n");
    expect(sql).toContain("`agreements`");
    expect(sql).toContain("`zone_agreements`");
  });
});

describe("agreementBackfill", () => {
  const seed = {
    agreements: [
      {
        id: "a1",
        title: "No fuego",
        description: "Sin fogatas",
        classic: "Fire",
        icon: "no-fire",
      },
    ],
    zoneAgreements: [
      {
        id: "za1",
        zoneId: "zone-live",
        agreementId: "a1",
        level: "Critical",
        position: 0,
        comment: null,
      },
      {
        id: "za2",
        zoneId: "zone-gone",
        agreementId: "a1",
        level: "Important",
        position: 0,
        comment: null,
      },
    ],
  };

  it("skips when agreements already exist so dashboard edits stay put", () => {
    expect(
      agreementBackfill(seed, new Set(["zone-live"]), true),
    ).toEqual({ agreements: [], zoneAgreements: [] });
  });

  it("keeps only zone_agreements whose zone already exists", () => {
    expect(
      agreementBackfill(seed, new Set(["zone-live"]), false),
    ).toEqual({
      agreements: seed.agreements,
      zoneAgreements: [seed.zoneAgreements[0]],
    });
  });
});

describe("isMissingSqliteTable", () => {
  it("detects the libsql missing-table error for a given table", () => {
    expect(
      isMissingSqliteTable(
        new Error("SQLITE_UNKNOWN_TABLE: no such table: zone_agreements"),
        "zone_agreements",
      ),
    ).toBe(true);
    expect(
      isMissingSqliteTable(
        new Error("SQLITE_UNKNOWN_TABLE: no such table: zone_agreements"),
        "agreements",
      ),
    ).toBe(false);
    expect(isMissingSqliteTable(new Error("UNIQUE constraint failed"), "agreements")).toBe(
      false,
    );
  });
});
