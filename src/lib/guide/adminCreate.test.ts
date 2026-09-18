import { describe, expect, it } from "vitest";
import { nextCreateStep } from "./adminCreate";

describe("nextCreateStep", () => {
  it("asks what to add first", () => {
    expect(nextCreateStep({ kind: null })).toBe("kind");
  });

  it("skips parents that are already known", () => {
    expect(nextCreateStep({ kind: "sector", zoneId: "z1" })).toBe("ready");
    expect(nextCreateStep({ kind: "pared", sectorId: "s1" })).toBe("ready");
    expect(nextCreateStep({ kind: "ruta", wallId: "w1" })).toBe("ready");
  });

  it("walks zona → sector → pared with the least questions", () => {
    expect(nextCreateStep({ kind: "ruta" })).toBe("zone");
    expect(nextCreateStep({ kind: "ruta", zoneId: "z1" })).toBe("sector");
    expect(
      nextCreateStep({ kind: "ruta", zoneId: "z1", sectorId: "s1" }),
    ).toBe("wall");
    expect(nextCreateStep({ kind: "pared" })).toBe("zone");
    expect(nextCreateStep({ kind: "pared", zoneId: "z1" })).toBe("sector");
    expect(nextCreateStep({ kind: "sector" })).toBe("zone");
  });
});
