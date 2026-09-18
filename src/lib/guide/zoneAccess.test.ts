import { describe, expect, it } from "vitest";
import {
  canMutateOwned,
  hasZoneAction,
  type ZoneAccess,
} from "./zoneAccess";

const admin: ZoneAccess = {
  platformAdmin: false,
  role: "admin",
  userId: "u1",
};
const editor: ZoneAccess = {
  platformAdmin: false,
  role: "editor",
  userId: "u1",
};
const collaborator: ZoneAccess = {
  platformAdmin: false,
  role: "collaborator",
  userId: "u1",
};
const outsider: ZoneAccess = {
  platformAdmin: false,
  role: null,
  userId: "u1",
};
const platform: ZoneAccess = {
  platformAdmin: true,
  role: null,
  userId: "u1",
};

describe("hasZoneAction", () => {
  it("lets a zone admin manage roles and zone metadata", () => {
    expect(hasZoneAction(admin, "assignRole")).toBe(true);
    expect(hasZoneAction(admin, "editZone")).toBe(true);
    expect(hasZoneAction(editor, "assignRole")).toBe(false);
  });

  it("lets an editor change any content but not the zone card", () => {
    expect(hasZoneAction(editor, "update")).toBe(true);
    expect(hasZoneAction(editor, "delete")).toBe(true);
    expect(hasZoneAction(editor, "editZone")).toBe(false);
  });

  it("lets a collaborator create, not rewrite others", () => {
    expect(hasZoneAction(collaborator, "create")).toBe(true);
    expect(hasZoneAction(collaborator, "update")).toBe(false);
  });

  it("lets a platform admin skip membership", () => {
    expect(hasZoneAction(platform, "assignRole")).toBe(true);
    expect(hasZoneAction(outsider, "create")).toBe(false);
  });
});

describe("canMutateOwned", () => {
  it("lets a collaborator edit only what they created", () => {
    expect(canMutateOwned(collaborator, "update", "u1")).toBe(true);
    expect(canMutateOwned(collaborator, "update", "u2")).toBe(false);
    expect(canMutateOwned(collaborator, "update", null)).toBe(false);
  });

  it("lets an editor rewrite seed content without an owner", () => {
    expect(canMutateOwned(editor, "update", null)).toBe(true);
  });
});
