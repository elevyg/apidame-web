import { describe, expect, it } from "vitest";
import {
  fitView,
  projectToImage,
  separatePins,
  webMercator,
} from "./mercator";

describe("webMercator", () => {
  it("puts the equator and Greenwich at the center of zoom 0", () => {
    expect(webMercator({ lat: 0, lng: 0 }, 0)).toEqual({ x: 128, y: 128 });
  });
});

describe("projectToImage", () => {
  it("places the center in the middle of the image", () => {
    const center = { lat: -46.55, lng: -71.72 };
    expect(projectToImage(center, center, 14, 800, 480)).toEqual({
      x: 400,
      y: 240,
    });
  });
});

describe("fitView", () => {
  it("keeps clustered Chile Chico sectors inside the padded frame", () => {
    const points = [
      { lat: -46.55598532, lng: -71.72159512 },
      { lat: -46.55849291, lng: -71.71930602 },
      { lat: -46.55358254, lng: -71.72157605 },
    ];
    const view = fitView(points, 800, 520, 48);
    for (const point of points) {
      const { x, y } = projectToImage(
        point,
        view.center,
        view.zoom,
        800,
        520,
      );
      expect(x).toBeGreaterThan(40);
      expect(x).toBeLessThan(760);
      expect(y).toBeGreaterThan(40);
      expect(y).toBeLessThan(480);
    }
  });
});

describe("separatePins", () => {
  it("pushes overlapping pins apart", () => {
    const separated = separatePins(
      [
        { id: "a", x: 100, y: 100 },
        { id: "b", x: 102, y: 100 },
      ],
      24,
      400,
      400,
      20,
    );
    expect(
      Math.hypot(separated[1]!.x - separated[0]!.x, separated[1]!.y - separated[0]!.y),
    ).toBeGreaterThanOrEqual(23.5);
  });
});
