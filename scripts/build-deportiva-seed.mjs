import fs from "node:fs";
import path from "node:path";

const EXTRACT =
  process.env.ANDESCALADA_EXTRACT ??
  path.join(
    process.env.HOME,
    "Downloads",
    "andescalada-prod-2026-09-16-topos-extract.json",
  );
const OUT = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "seed",
  "deportiva.json",
);

const SKIP_SECTOR_SLUGS = new Set(["test"]);

const isLive = (row) => row.isDeleted === "NotDeleted";

const extract = JSON.parse(fs.readFileSync(EXTRACT, "utf8"));
const texts = Object.fromEntries(
  extract.texts.map((t) => [t.id, t.originalText]),
);
const images = Object.fromEntries(extract.images.map((i) => [i.id, i]));
const grades = Object.fromEntries(extract.grades.map((g) => [g.routeId, g]));
const lengths = Object.fromEntries(
  extract.lengths.map((l) => [l.routeId, l]),
);

const zones = extract.zones.filter(isLive).map((z) => {
  const cover = z.coverPhotoId ? images[z.coverPhotoId] : null;
  return {
    id: z.id,
    slug: z.slug,
    name: z.name,
    description: texts[z.descriptionId] ?? null,
    coverImageUrl: cover?.url ?? null,
    coverImageWidth: cover?.width ?? null,
    coverImageHeight: cover?.height ?? null,
    coverPublicId: cover?.publicId ?? null,
    published: z.currentStatus === "Published",
  };
});

const zoneIds = new Set(zones.map((z) => z.id));
const sectors = extract.sectors
  .filter(
    (s) =>
      isLive(s) &&
      zoneIds.has(s.zoneId) &&
      !SKIP_SECTOR_SLUGS.has(s.slug),
  )
  .map((s) => ({
    id: s.id,
    zoneId: s.zoneId,
    slug: s.slug,
    name: s.name,
    position: s.position,
    kind: s.sectorKind,
  }));

const sectorIds = new Set(sectors.map((s) => s.id));
const walls = extract.walls
  .filter((w) => isLive(w) && sectorIds.has(w.sectorId))
  .map((w) => ({
    id: w.id,
    sectorId: w.sectorId,
    slug: w.slug,
    name: w.name,
    position: w.position,
  }));

const wallIds = new Set(walls.map((w) => w.id));
const topos = extract.topos
  .filter((t) => isLive(t) && wallIds.has(t.wallId))
  .map((t) => {
    const image = images[t.imageId];
    return {
      id: t.id,
      wallId: t.wallId,
      slug: t.slug,
      name: t.name,
      position: t.position,
      main: Boolean(t.main),
      routeStrokeWidth: Number(t.routeStrokeWidth ?? 1),
      imageUrl: image?.url ?? null,
      imageWidth: image?.width ?? null,
      imageHeight: image?.height ?? null,
      imagePublicId: image?.publicId ?? null,
    };
  })
  .filter((t) => t.imageUrl);

const topoIds = new Set(topos.map((t) => t.id));
const routes = extract.routes
  .filter((r) => isLive(r) && wallIds.has(r.wallId))
  .map((r) => {
    const grade = grades[r.id];
    const length = lengths[r.id];
    return {
      id: r.id,
      wallId: r.wallId,
      slug: r.slug,
      name: r.name,
      position: r.position,
      kind: r.kind,
      unknownName: Boolean(r.unknownName),
      description: texts[r.descriptionId] ?? null,
      grade: grade?.originalGrade ?? (grade?.grade != null ? String(grade.grade) : null),
      gradeSystem: grade?.originalGradeSystem ?? null,
      length: length ? Number(length.length) : null,
      lengthUnit: length?.unit ?? null,
    };
  });

const routeIds = new Set(routes.map((r) => r.id));
const paths = extract.paths
  .filter(
    (p) => isLive(p) && topoIds.has(p.topoId) && routeIds.has(p.routeId),
  )
  .map((p) => ({
    id: p.id,
    topoId: p.topoId,
    routeId: p.routeId,
    path: p.path,
    labelPoint: p.labelPoint,
    pitchLabelPoint: p.pitchLabelPoint,
    hideStart: Boolean(p.hideStart),
  }));

const seed = {
  generatedFrom: path.basename(EXTRACT),
  zones,
  sectors,
  walls,
  topos,
  routes,
  paths,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(seed, null, 2));
console.log(
  JSON.stringify(
    {
      out: OUT,
      zones: zones.length,
      sectors: sectors.length,
      walls: walls.length,
      topos: topos.length,
      routes: routes.length,
      paths: paths.length,
    },
    null,
    2,
  ),
);
