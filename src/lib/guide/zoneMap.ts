import type { getZoneBySlug } from "./queries";
import type { MapmableZone } from "./mapView";

type ZoneGuide = NonNullable<Awaited<ReturnType<typeof getZoneBySlug>>>;

export function zoneToMapInput(guide: ZoneGuide): MapmableZone {
  return {
    slug: guide.zone.slug,
    latitude: guide.zone.latitude,
    longitude: guide.zone.longitude,
    sectors: guide.sectors.map((sector) => ({
      id: sector.id,
      slug: sector.slug,
      name: sector.name,
      position: sector.position,
      latitude: sector.latitude,
      longitude: sector.longitude,
      walls: guide.walls
        .filter((wall) => wall.sectorId === sector.id)
        .map((wall) => ({
          slug: wall.slug,
          name: wall.name,
          routes: guide.routes.filter((route) => route.wallId === wall.id)
            .length,
        })),
    })),
  };
}

export function directionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
