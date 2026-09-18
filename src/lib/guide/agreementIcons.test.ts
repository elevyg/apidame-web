import { describe, expect, it } from "vitest";
import { agreementIconFile } from "./agreementIcons";

describe("agreementIconFile", () => {
  it("prefers the color Andescalada icon when it exists", () => {
    const file = agreementIconFile("no-fire");
    expect(file).toMatch(/no-fire-color\.svg$/);
  });

  it("returns null for unknown icons", () => {
    expect(agreementIconFile("not-a-real-icon")).toBeNull();
  });
});
