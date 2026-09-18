import { describe, expect, it } from "vitest";
import { buildZoneMapView, WEB_MAP_SIZE } from "./mapView";

describe("buildZoneMapView", () => {
  it("numbers sectors by position and keeps pins on the image", () => {
    const view = buildZoneMapView(
      {
        slug: "cerro-el-indio",
        latitude: -46.55745747,
        longitude: -71.72237467,
        sectors: [
          {
            id: "b",
            slug: "el-queso",
            name: "El queso",
            position: 3,
            latitude: -46.55849291,
            longitude: -71.71930602,
            walls: [{ slug: "centro", name: "Centro", routes: 4 }],
          },
          {
            id: "a",
            slug: "la-buena-vaina",
            name: "La buena vaina",
            position: 1,
            latitude: -46.55645598,
            longitude: -71.72141448,
            walls: [{ slug: "principal", name: "Principal", routes: 6 }],
          },
        ],
      },
      WEB_MAP_SIZE,
    );

    expect(view).not.toBeNull();
    expect(view?.pins.map((pin) => pin.slug)).toEqual([
      "la-buena-vaina",
      "el-queso",
    ]);
    expect(view?.pins[0]?.walls[0]?.href).toBe(
      "/deportiva/cerro-el-indio/la-buena-vaina/principal",
    );
    for (const pin of view?.pins ?? []) {
      expect(pin.x).toBeGreaterThan(20);
      expect(pin.x).toBeLessThan(WEB_MAP_SIZE.width - 20);
      expect(pin.y).toBeGreaterThan(20);
      expect(pin.y).toBeLessThan(WEB_MAP_SIZE.height - 20);
    }
  });

  it("leaves overlapping pins on their projected pixel when separation is off", () => {
    const view = buildZoneMapView(
      {
        slug: "cerro-el-indio",
        latitude: -46.557,
        longitude: -71.722,
        sectors: [
          {
            id: "a",
            slug: "a",
            name: "A",
            position: 1,
            latitude: -46.557,
            longitude: -71.722,
            walls: [],
          },
          {
            id: "b",
            slug: "b",
            name: "B",
            position: 2,
            latitude: -46.55701,
            longitude: -71.72201,
            walls: [],
          },
        ],
      },
      WEB_MAP_SIZE,
      { separatePins: false },
    );
    expect(view?.pins).toHaveLength(2);
    const dx = Math.abs((view?.pins[0]?.x ?? 0) - (view?.pins[1]?.x ?? 0));
    const dy = Math.abs((view?.pins[0]?.y ?? 0) - (view?.pins[1]?.y ?? 0));
    expect(Math.hypot(dx, dy)).toBeLessThan(8);
  });

  it("returns null when nothing has coordinates", () => {
    expect(
      buildZoneMapView(
        {
          slug: "x",
          latitude: null,
          longitude: null,
          sectors: [
            {
              id: "s",
              slug: "s",
              name: "S",
              position: 0,
              latitude: null,
              longitude: null,
              walls: [],
            },
          ],
        },
        WEB_MAP_SIZE,
      ),
    ).toBeNull();
  });
});
