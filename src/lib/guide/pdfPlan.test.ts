import { describe, expect, it } from "vitest";
import { minGuidebookPages } from "./pdfPlan";

describe("minGuidebookPages", () => {
  it("counts cover, agreements, and one page per wall", () => {
    expect(
      minGuidebookPages({
        rules: { length: 5 },
        walls: { length: 3 },
      }),
    ).toBe(5);
  });

  it("treats a 2-page cover-and-map blob as incomplete for Burgos", () => {
    const floor = minGuidebookPages({
      rules: { length: 5 },
      walls: { length: 3 },
    });
    expect(2).toBeLessThan(floor);
  });

  it("skips the agreements page when the zone has no rules", () => {
    expect(
      minGuidebookPages({
        rules: { length: 0 },
        walls: { length: 1 },
      }),
    ).toBe(2);
  });
});
