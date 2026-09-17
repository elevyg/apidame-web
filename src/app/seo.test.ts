import { describe, expect, it } from "vitest";
import { flattenDescription } from "./seo";

describe("flattenDescription", () => {
  it("collapses whitespace and keeps short copy", () => {
    expect(
      flattenDescription(
        "Cerro el indio fue el primer sector.\n\nNo somos muy bienvenidos.",
        "fallback",
      ),
    ).toBe(
      "Cerro el indio fue el primer sector. No somos muy bienvenidos.",
    );
  });

  it("cuts on a word boundary", () => {
    const long = `${"palabra ".repeat(30)}final`;
    const result = flattenDescription(long, "fallback", 40);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(40);
    expect(result.slice(0, -1).endsWith("palabra")).toBe(true);
  });

  it("uses the fallback when empty", () => {
    expect(flattenDescription("  ", "Topo en Chile Chico.")).toBe(
      "Topo en Chile Chico.",
    );
  });
});
