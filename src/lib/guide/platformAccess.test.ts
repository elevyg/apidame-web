import { describe, expect, it } from "vitest";
import {
  canAssignPlatformAdmin,
  storedUserRole,
} from "./platformAccess";

describe("storedUserRole", () => {
  it("keeps the bootstrap email as admin", () => {
    expect(storedUserRole("elevyg91@gmail.com", "user")).toBe("admin");
    expect(storedUserRole("elevyg91@gmail.com", null)).toBe("admin");
  });

  it("keeps an appointed admin across logins", () => {
    expect(storedUserRole("otra@apidame.cl", "admin")).toBe("admin");
    expect(storedUserRole("otra@apidame.cl", "user")).toBe("user");
  });
});

describe("canAssignPlatformAdmin", () => {
  it("lets only the super-admin appoint or revoke other admins", () => {
    expect(
      canAssignPlatformAdmin({ superAdmin: true }, "otra@apidame.cl"),
    ).toBe(true);
    expect(
      canAssignPlatformAdmin({ superAdmin: false }, "otra@apidame.cl"),
    ).toBe(false);
    expect(
      canAssignPlatformAdmin({ superAdmin: true }, "elevyg91@gmail.com"),
    ).toBe(false);
  });
});
