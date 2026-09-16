import { describe, expect, it } from "vitest";
import { fitRect, sanitizePdfText, wrapWords } from "./layout";

describe("fitRect", () => {
  it("fits a landscape topo into a portrait phone page", () => {
    const box = fitRect(4032, 3024, 372, 520);
    expect(box.width).toBeCloseTo(372);
    expect(box.height).toBeLessThanOrEqual(520);
    expect(box.width / box.height).toBeCloseTo(4032 / 3024);
  });
});

describe("wrapWords", () => {
  it("keeps words intact under a char budget", () => {
    expect(wrapWords("usa casco en la pared", 10)).toEqual([
      "usa casco",
      "en la",
      "pared",
    ]);
  });
});

describe("sanitizePdfText", () => {
  it("turns the warning emoji into latin text Helvetica can encode", () => {
    expect(sanitizePdfText("⚠️ Usa casco")).toBe("ATENCION Usa casco");
  });

  it("keeps spanish accents that WinAnsi supports", () => {
    expect(sanitizePdfText("Mañera Nocturna · Corazón")).toBe(
      "Mañera Nocturna · Corazón",
    );
  });
});
