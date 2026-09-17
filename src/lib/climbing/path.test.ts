import { describe, expect, it } from "vitest";
import {
  fitDiscLabelSize,
  parsePath,
  parsePoint,
  pointerRadius,
  pointerRingWidth,
  serializePath,
  strokeWidthPx,
} from "./path";

describe("parsePath", () => {
  it("reads space-separated image points from andescalada", () => {
    expect(parsePath("1507.8,2163.3 1482.8,2077.1")).toEqual([
      { x: 1507.8, y: 2163.3 },
      { x: 1482.8, y: 2077.1 },
    ]);
  });

  it("returns empty for missing paths", () => {
    expect(parsePath(undefined)).toEqual([]);
    expect(parsePath("")).toEqual([]);
  });
});

describe("serializePath", () => {
  it("roundtrips a drawn line", () => {
    const points = [
      { x: 10, y: 20 },
      { x: 30, y: 40 },
    ];
    expect(parsePath(serializePath(points))).toEqual(points);
  });
});

describe("parsePoint", () => {
  it("reads a label point", () => {
    expect(parsePoint("12.5,80")).toEqual({ x: 12.5, y: 80 });
  });
});

describe("strokeWidthPx", () => {
  it("matches the Skia drawer formula", () => {
    expect(strokeWidthPx(1, 1)).toBe(21.5);
    expect(strokeWidthPx(0.5, 2)).toBe(21.5);
  });
});

describe("pointerRadius", () => {
  it("keeps the andescalada start disc readable on a 4k topo", () => {
    expect(pointerRadius(1)).toBe(100);
    expect(pointerRadius(0.43)).toBe(90);
  });
});

describe("fitDiscLabelSize", () => {
  it("keeps two-digit labels inside a small PDF disc", () => {
    const radius = 8;
    const size = fitDiscLabelSize("12", radius, (fontSize) => fontSize * 1.15);
    expect(size * 1.15).toBeLessThanOrEqual(radius * 2 - pointerRingWidth(radius) * 2);
  });
});
