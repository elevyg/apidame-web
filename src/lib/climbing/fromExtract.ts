const SKIP_SECTOR_SLUGS = new Set(["test"]);

export type ExtractDump = {
  zones: Array<Record<string, unknown>>;
  sectors: Array<Record<string, unknown>>;
  walls: Array<Record<string, unknown>>;
  topos: Array<Record<string, unknown>>;
  routes: Array<Record<string, unknown>>;
  paths: Array<Record<string, unknown>>;
  grades: Array<Record<string, unknown>>;
  lengths: Array<Record<string, unknown>>;
  images: Array<Record<string, unknown>>;
  texts: Array<Record<string, unknown>>;
};

export type GuideSeed = {
  zones: SeedZone[];
  sectors: SeedSector[];
  walls: SeedWall[];
  topos: SeedTopo[];
  routes: SeedRoute[];
  paths: SeedPath[];
};

export type SeedZone = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  coverImageWidth: number | null;
  coverImageHeight: number | null;
  coverPublicId: string | null;
  published: boolean;
  latitude: number | null;
  longitude: number | null;
};

export type SeedSector = {
  id: string;
  zoneId: string;
  slug: string;
  name: string;
  position: number;
  kind: string;
  latitude: number | null;
  longitude: number | null;
};

export type LocationSeed = {
  zones: Record<string, { latitude: number; longitude: number }>;
  sectors: Record<string, { latitude: number; longitude: number }>;
};

export type SeedWall = {
  id: string;
  sectorId: string;
  slug: string;
  name: string;
  position: number;
};

export type SeedTopo = {
  id: string;
  wallId: string;
  slug: string;
  name: string | null;
  position: number;
  main: boolean;
  routeStrokeWidth: number;
  imageUrl: string;
  imageWidth: number | null;
  imageHeight: number | null;
  imagePublicId: string | null;
};

export type SeedRoute = {
  id: string;
  wallId: string;
  slug: string;
  name: string;
  position: number;
  kind: string;
  unknownName: boolean;
  description: string | null;
  grade: string | null;
  gradeSystem: string | null;
  length: number | null;
  lengthUnit: string | null;
};

export type SeedPath = {
  id: string;
  topoId: string;
  routeId: string;
  path: string;
  labelPoint: string | null;
  pitchLabelPoint: string | null;
  hideStart: boolean;
};

const isLive = (row: Record<string, unknown>) =>
  row.isDeleted === "NotDeleted";

export function seedFromExtract(extract: ExtractDump): GuideSeed {
  const texts = Object.fromEntries(
    extract.texts.map((text) => [String(text.id), String(text.originalText)]),
  );
  const images = Object.fromEntries(
    extract.images.map((image) => [String(image.id), image]),
  );
  const grades = Object.fromEntries(
    extract.grades.map((grade) => [String(grade.routeId), grade]),
  );
  const lengths = Object.fromEntries(
    extract.lengths.map((length) => [String(length.routeId), length]),
  );

  const zones: SeedZone[] = extract.zones.filter(isLive).map((zone) => {
    const cover = zone.coverPhotoId
      ? images[String(zone.coverPhotoId)]
      : undefined;
    return {
      id: String(zone.id),
      slug: String(zone.slug),
      name: String(zone.name),
      description: zone.descriptionId
        ? (texts[String(zone.descriptionId)] ?? null)
        : null,
      coverImageUrl: cover ? String(cover.url) : null,
      coverImageWidth: cover ? Number(cover.width) : null,
      coverImageHeight: cover ? Number(cover.height) : null,
      coverPublicId: cover?.publicId ? String(cover.publicId) : null,
      published: zone.currentStatus === "Published",
      latitude: null,
      longitude: null,
    };
  });

  const zoneIds = new Set(zones.map((zone) => zone.id));
  const sectors: SeedSector[] = extract.sectors
    .filter(
      (sector) =>
        isLive(sector) &&
        zoneIds.has(String(sector.zoneId)) &&
        !SKIP_SECTOR_SLUGS.has(String(sector.slug)),
    )
    .map((sector) => ({
      id: String(sector.id),
      zoneId: String(sector.zoneId),
      slug: String(sector.slug),
      name: String(sector.name),
      position: Number(sector.position),
      kind: String(sector.sectorKind ?? "Wall"),
      latitude: null,
      longitude: null,
    }));

  const sectorIds = new Set(sectors.map((sector) => sector.id));
  const walls: SeedWall[] = extract.walls
    .filter(
      (wall) => isLive(wall) && sectorIds.has(String(wall.sectorId)),
    )
    .map((wall) => ({
      id: String(wall.id),
      sectorId: String(wall.sectorId),
      slug: String(wall.slug),
      name: String(wall.name),
      position: Number(wall.position),
    }));

  const wallIds = new Set(walls.map((wall) => wall.id));
  const topos: SeedTopo[] = extract.topos
    .filter((topo) => isLive(topo) && wallIds.has(String(topo.wallId)))
    .flatMap((topo) => {
      const image = images[String(topo.imageId)];
      if (!image?.url) return [];
      return [
        {
          id: String(topo.id),
          wallId: String(topo.wallId),
          slug: String(topo.slug),
          name: topo.name == null ? null : String(topo.name),
          position: Number(topo.position),
          main: Boolean(topo.main),
          routeStrokeWidth: Number(topo.routeStrokeWidth ?? 1),
          imageUrl: String(image.url),
          imageWidth: image.width == null ? null : Number(image.width),
          imageHeight: image.height == null ? null : Number(image.height),
          imagePublicId: image.publicId ? String(image.publicId) : null,
        },
      ];
    });

  const topoIds = new Set(topos.map((topo) => topo.id));
  const routes: SeedRoute[] = extract.routes
    .filter((route) => isLive(route) && wallIds.has(String(route.wallId)))
    .map((route) => {
      const grade = grades[String(route.id)];
      const length = lengths[String(route.id)];
      const originalGrade = grade?.originalGrade;
      const numericGrade = grade?.grade;
      return {
        id: String(route.id),
        wallId: String(route.wallId),
        slug: String(route.slug),
        name: String(route.name),
        position: Number(route.position),
        kind: String(route.kind),
        unknownName: Boolean(route.unknownName),
        description: route.descriptionId
          ? (texts[String(route.descriptionId)] ?? null)
          : null,
        grade:
          originalGrade != null && originalGrade !== ""
            ? String(originalGrade)
            : numericGrade != null
              ? String(numericGrade)
              : null,
        gradeSystem: grade?.originalGradeSystem
          ? String(grade.originalGradeSystem)
          : null,
        length: length?.length == null ? null : Number(length.length),
        lengthUnit: length?.unit ? String(length.unit) : null,
      };
    });

  const routeIds = new Set(routes.map((route) => route.id));
  const paths: SeedPath[] = extract.paths
    .filter(
      (path) =>
        isLive(path) &&
        topoIds.has(String(path.topoId)) &&
        routeIds.has(String(path.routeId)),
    )
    .map((path) => ({
      id: String(path.id),
      topoId: String(path.topoId),
      routeId: String(path.routeId),
      path: String(path.path),
      labelPoint: path.labelPoint == null ? null : String(path.labelPoint),
      pitchLabelPoint:
        path.pitchLabelPoint == null ? null : String(path.pitchLabelPoint),
      hideStart: Boolean(path.hideStart),
    }));

  return { zones, sectors, walls, topos, routes, paths };
}

export function applyLocations(
  seed: GuideSeed,
  locations: LocationSeed,
): GuideSeed {
  return {
    ...seed,
    zones: seed.zones.map((zone) => {
      const point = locations.zones[zone.id];
      return point
        ? { ...zone, latitude: point.latitude, longitude: point.longitude }
        : zone;
    }),
    sectors: seed.sectors.map((sector) => {
      const point = locations.sectors[sector.id];
      return point
        ? { ...sector, latitude: point.latitude, longitude: point.longitude }
        : sector;
    }),
  };
}
