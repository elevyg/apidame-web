import { describe, expect, it } from "vitest";
import {
  agreementRank,
  coverCrop,
  cropAroundPaths,
  mapCanvasRect,
  pixelCrop,
} from "./overlay";

describe("cropAroundPaths", () => {
  it("zooms into a small cluster on a distant photo", () => {
    const crop = cropAroundPaths(
      [
        { x: 1900, y: 1400 },
        { x: 1980, y: 1520 },
      ],
      4000,
      3000,
    );
    expect(crop.width).toBeLessThan(4000 * 0.4);
    expect(crop.height).toBeLessThan(3000 * 0.4);
    expect(crop.x).toBeGreaterThan(1500);
    expect(crop.y).toBeGreaterThan(1000);
  });

  it("keeps the full frame when routes already span the photo", () => {
    const crop = cropAroundPaths(
      [
        { x: 80, y: 60 },
        { x: 3920, y: 2940 },
      ],
      4000,
      3000,
    );
    expect(crop).toEqual({ x: 0, y: 0, width: 4000, height: 3000 });
  });
});

describe("mapCanvasRect", () => {
  it("maps a canvas crop onto a smaller downloaded bitmap", () => {
    const mapped = mapCanvasRect(
      { x: 1000, y: 500, width: 2000, height: 1500 },
      4000,
      3000,
      1200,
      900,
    );
    expect(mapped).toEqual({ x: 300, y: 150, width: 600, height: 450 });
  });
});

describe("coverCrop", () => {
  it("fills a tall phone page from a landscape photo", () => {
    const crop = coverCrop(4032, 3024, 420, 844);
    expect(crop.width / crop.height).toBeCloseTo(420 / 844, 2);
    expect(crop.height).toBeLessThanOrEqual(3024);
  });
});

describe("pixelCrop", () => {
  it("stays inside the bitmap", () => {
    const crop = pixelCrop(
      { x: 10.2, y: 8.8, width: 40.1, height: 20.4 },
      50,
      30,
    );
    expect(crop.x + crop.width).toBeLessThanOrEqual(50);
    expect(crop.y + crop.height).toBeLessThanOrEqual(30);
  });

  it("falls back inside when the box is off the bitmap", () => {
    const crop = pixelCrop({ x: 900, y: 20, width: 40, height: 20 }, 200, 100);
    expect(crop.x).toBeGreaterThanOrEqual(0);
    expect(crop.x + crop.width).toBeLessThanOrEqual(200);
  });
});

describe("agreementRank", () => {
  it("puts critical rules first", () => {
    expect(agreementRank("Critical")).toBeLessThan(agreementRank("Important"));
    expect(agreementRank("Important")).toBeLessThan(agreementRank("Recommended"));
  });
});
