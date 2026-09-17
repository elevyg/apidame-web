import {
  fitView,
  projectToImage,
  separatePins,
  type GeoPoint,
} from "../geo/mercator";

export const WEB_MAP_SIZE = { width: 800, height: 520 };
export const PDF_MAP_SIZE = { width: 364, height: 300 };

export type MapWall = {
  slug: string;
  name: string;
  href: string;
  routes: number;
};

export type MapPin = {
  id: string;
  number: number;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  x: number;
  y: number;
  walls: MapWall[];
};

export type ZoneMapView = {
  center: GeoPoint;
  zoom: number;
  width: number;
  height: number;
  pins: MapPin[];
};

export type MapmableZone = {
  slug: string;
  latitude: number | null;
  longitude: number | null;
  sectors: {
    id: string;
    slug: string;
    name: string;
    position: number;
    latitude: number | null;
    longitude: number | null;
    walls: Omit<MapWall, "href">[];
  }[];
};

export function buildZoneMapView(
  zone: MapmableZone,
  size: { width: number; height: number },
): ZoneMapView | null {
  const raw = [...zone.sectors]
    .sort((a, b) => a.position - b.position || a.name.localeCompare(b.name))
    .flatMap((sector) => {
      const latitude = sector.latitude ?? zone.latitude;
      const longitude = sector.longitude ?? zone.longitude;
      if (latitude == null || longitude == null) return [];
      return [
        {
          id: sector.id,
          name: sector.name,
          slug: sector.slug,
          latitude,
          longitude,
          walls: sector.walls.map((wall) => ({
            ...wall,
            href: `/deportiva/${zone.slug}/${sector.slug}/${wall.slug}`,
          })),
        },
      ];
    });

  if (raw.length === 0) return null;

  const padding = Math.round(Math.min(size.width, size.height) * 0.12);
  const view = fitView(
    raw.map((pin) => ({ lat: pin.latitude, lng: pin.longitude })),
    size.width,
    size.height,
    padding,
  );

  const projected = raw.map((pin, index) => {
    const point = projectToImage(
      { lat: pin.latitude, lng: pin.longitude },
      view.center,
      view.zoom,
      size.width,
      size.height,
    );
    return {
      ...pin,
      number: index + 1,
      x: point.x,
      y: point.y,
    };
  });

  return {
    center: view.center,
    zoom: view.zoom,
    width: size.width,
    height: size.height,
    pins: separatePins(projected, 28, size.width, size.height, padding),
  };
}
