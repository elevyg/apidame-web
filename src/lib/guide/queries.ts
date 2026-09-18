import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import {
  agreements,
  routePaths,
  routes,
  sectors,
  topos,
  walls,
  zoneAgreements,
  zones,
} from "@/db/schema";
import { withFrenchGrade } from "@/lib/climbing/frenchGrade";
import { agreementRank } from "@/lib/guide/overlay";
import type { CloudinaryImage } from "@/lib/climbing/cloudinary";
import { listGuideImagesOrEmpty } from "@/lib/climbing/cloudinary";
import type { AdminSearchItem } from "./adminSearch";
import { notFound } from "next/navigation";

export async function listPublishedZones() {
  return db
    .select()
    .from(zones)
    .where(eq(zones.published, true))
    .orderBy(asc(zones.name));
}

export async function listAllZones() {
  return db.select().from(zones).orderBy(asc(zones.name));
}

export async function getZoneBySlug(slug: string) {
  const zone = await db
    .select()
    .from(zones)
    .where(eq(zones.slug, slug))
    .then((rows) => rows[0] ?? null);
  if (!zone) return null;

  const zoneSectors = await db
    .select()
    .from(sectors)
    .where(eq(sectors.zoneId, zone.id))
    .orderBy(asc(sectors.position), asc(sectors.name));

  const sectorIds = zoneSectors.map((sector) => sector.id);
  const zoneWalls =
    sectorIds.length === 0
      ? []
      : await db
          .select()
          .from(walls)
          .where(inArray(walls.sectorId, sectorIds))
          .orderBy(asc(walls.position), asc(walls.name));

  const wallIds = zoneWalls.map((wall) => wall.id);
  const zoneRoutes =
    wallIds.length === 0
      ? []
      : await db
          .select()
          .from(routes)
          .where(inArray(routes.wallId, wallIds))
          .orderBy(asc(routes.position), asc(routes.name));

  const zoneTopos =
    wallIds.length === 0
      ? []
      : await db
          .select()
          .from(topos)
          .where(inArray(topos.wallId, wallIds))
          .orderBy(asc(topos.position));

  const topoIds = zoneTopos.map((topo) => topo.id);
  const zonePaths =
    topoIds.length === 0
      ? []
      : await db
          .select()
          .from(routePaths)
          .where(inArray(routePaths.topoId, topoIds));

  const zoneRuleRows = await db
    .select({
      id: zoneAgreements.id,
      level: zoneAgreements.level,
      position: zoneAgreements.position,
      comment: zoneAgreements.comment,
      title: agreements.title,
      description: agreements.description,
      classic: agreements.classic,
      icon: agreements.icon,
    })
    .from(zoneAgreements)
    .innerJoin(agreements, eq(zoneAgreements.agreementId, agreements.id))
    .where(eq(zoneAgreements.zoneId, zone.id));

  const rules = [...zoneRuleRows].sort((a, b) => {
    const rank = agreementRank(a.level) - agreementRank(b.level);
    if (rank !== 0) return rank;
    return a.title.localeCompare(b.title, "es");
  });

  return {
    zone,
    sectors: zoneSectors,
    walls: zoneWalls,
    routes: zoneRoutes.map(withFrenchGrade),
    topos: zoneTopos,
    paths: zonePaths,
    rules,
  };
}

export async function getZoneById(id: string) {
  const zone = await db
    .select()
    .from(zones)
    .where(eq(zones.id, id))
    .then((rows) => rows[0] ?? null);
  if (!zone) return null;
  return getZoneBySlug(zone.slug);
}

export async function requireZoneBySlug(slug: string) {
  const data = await getZoneBySlug(slug);
  if (!data || !data.zone.published) notFound();
  return data;
}

export async function getWallGuide(
  zoneSlug: string,
  sectorSlug: string,
  wallSlug: string,
) {
  const zone = await db
    .select()
    .from(zones)
    .where(eq(zones.slug, zoneSlug))
    .then((rows) => rows[0] ?? null);
  if (!zone) return null;

  const sector = await db
    .select()
    .from(sectors)
    .where(and(eq(sectors.zoneId, zone.id), eq(sectors.slug, sectorSlug)))
    .then((rows) => rows[0] ?? null);
  if (!sector) return null;

  const wall = await db
    .select()
    .from(walls)
    .where(and(eq(walls.sectorId, sector.id), eq(walls.slug, wallSlug)))
    .then((rows) => rows[0] ?? null);
  if (!wall) return null;

  const wallTopos = await db
    .select()
    .from(topos)
    .where(eq(topos.wallId, wall.id))
    .orderBy(asc(topos.position));

  const wallRoutes = await db
    .select()
    .from(routes)
    .where(eq(routes.wallId, wall.id))
    .orderBy(asc(routes.position), asc(routes.name));

  const topoIds = wallTopos.map((topo) => topo.id);
  const paths =
    topoIds.length === 0
      ? []
      : await db
          .select()
          .from(routePaths)
          .where(inArray(routePaths.topoId, topoIds));

  return {
    zone,
    sector,
    wall,
    topos: wallTopos,
    routes: wallRoutes.map(withFrenchGrade),
    paths,
  };
}

export async function requireWallGuide(
  zoneSlug: string,
  sectorSlug: string,
  wallSlug: string,
) {
  const data = await getWallGuide(zoneSlug, sectorSlug, wallSlug);
  if (!data || !data.zone.published) notFound();
  return data;
}

export async function getWallById(wallId: string) {
  const wall = await db
    .select()
    .from(walls)
    .where(eq(walls.id, wallId))
    .then((rows) => rows[0] ?? null);
  if (!wall) return null;
  const sector = await db
    .select()
    .from(sectors)
    .where(eq(sectors.id, wall.sectorId))
    .then((rows) => rows[0] ?? null);
  if (!sector) return null;
  const zone = await db
    .select()
    .from(zones)
    .where(eq(zones.id, sector.zoneId))
    .then((rows) => rows[0] ?? null);
  if (!zone) return null;
  return { wall, sector, zone };
}

export async function getTopoEditor(topoId: string) {
  const topo = await db
    .select()
    .from(topos)
    .where(eq(topos.id, topoId))
    .then((rows) => rows[0] ?? null);
  if (!topo) return null;
  const context = await getWallById(topo.wallId);
  if (!context) return null;
  const wallRoutes = await db
    .select()
    .from(routes)
    .where(eq(routes.wallId, topo.wallId))
    .orderBy(asc(routes.position));
  const paths = await db
    .select()
    .from(routePaths)
    .where(eq(routePaths.topoId, topo.id));
  return { topo, ...context, routes: wallRoutes.map(withFrenchGrade), paths };
}

export async function listGuidePhotoLibrary(): Promise<CloudinaryImage[]> {
  const [topoRows, zoneRows, uploaded] = await Promise.all([
    db
      .select({
        url: topos.imageUrl,
        publicId: topos.imagePublicId,
        width: topos.imageWidth,
        height: topos.imageHeight,
      })
      .from(topos),
    db
      .select({
        url: zones.coverImageUrl,
        publicId: zones.coverPublicId,
        width: zones.coverImageWidth,
        height: zones.coverImageHeight,
      })
      .from(zones),
    listGuideImagesOrEmpty("apidame/guia"),
  ]);
  const seen = new Set<string>();
  const library: CloudinaryImage[] = [];
  for (const row of [...uploaded, ...topoRows, ...zoneRows]) {
    if (!row.url) continue;
    const key = row.publicId || row.url;
    if (seen.has(key)) continue;
    seen.add(key);
    library.push({
      url: row.url,
      publicId: row.publicId ?? row.url,
      width: row.width ?? null,
      height: row.height ?? null,
    });
  }
  return library;
}

export async function getAdminCatalog(): Promise<AdminSearchItem[]> {
  const [zoneRows, sectorRows, wallRows, routeRows] = await Promise.all([
    db.select().from(zones).orderBy(asc(zones.name)),
    db.select().from(sectors).orderBy(asc(sectors.position), asc(sectors.name)),
    db.select().from(walls).orderBy(asc(walls.position), asc(walls.name)),
    db.select().from(routes).orderBy(asc(routes.position), asc(routes.name)),
  ]);
  const zoneById = new Map(zoneRows.map((zone) => [zone.id, zone]));
  const sectorById = new Map(sectorRows.map((sector) => [sector.id, sector]));
  const wallById = new Map(wallRows.map((wall) => [wall.id, wall]));

  const items: AdminSearchItem[] = zoneRows.map((zone) => ({
    kind: "zona",
    id: zone.id,
    name: zone.name,
    href: `/dashboard/zonas/${zone.id}`,
    crumb: zone.published ? "Publicada" : "Oculta",
    zoneId: zone.id,
  }));

  for (const sector of sectorRows) {
    const zone = zoneById.get(sector.zoneId);
    if (!zone) continue;
    items.push({
      kind: "sector",
      id: sector.id,
      name: sector.name,
      href: `/dashboard/zonas/${zone.id}#sector-${sector.id}`,
      crumb: zone.name,
      zoneId: zone.id,
      sectorId: sector.id,
    });
  }

  for (const wall of wallRows) {
    const sector = sectorById.get(wall.sectorId);
    const zone = sector ? zoneById.get(sector.zoneId) : undefined;
    if (!sector || !zone) continue;
    items.push({
      kind: "pared",
      id: wall.id,
      name: wall.name,
      href: `/dashboard/paredes/${wall.id}`,
      crumb: `${zone.name} · ${sector.name}`,
      zoneId: zone.id,
      sectorId: sector.id,
      wallId: wall.id,
    });
  }

  for (const route of routeRows) {
    const wall = wallById.get(route.wallId);
    const sector = wall ? sectorById.get(wall.sectorId) : undefined;
    const zone = sector ? zoneById.get(sector.zoneId) : undefined;
    if (!wall || !sector || !zone) continue;
    items.push({
      kind: "ruta",
      id: route.id,
      name: route.name,
      href: `/dashboard/rutas/${route.id}`,
      crumb: `${zone.name} · ${wall.name}`,
      zoneId: zone.id,
      sectorId: sector.id,
      wallId: wall.id,
    });
  }

  return items;
}

export async function getAdminTree() {
  const [zoneRows, sectorRows, wallRows] = await Promise.all([
    db.select().from(zones).orderBy(asc(zones.name)),
    db.select().from(sectors).orderBy(asc(sectors.position), asc(sectors.name)),
    db.select().from(walls).orderBy(asc(walls.position), asc(walls.name)),
  ]);
  return zoneRows.map((zone) => ({
    ...zone,
    sectors: sectorRows
      .filter((sector) => sector.zoneId === zone.id)
      .map((sector) => ({
        ...sector,
        walls: wallRows.filter((wall) => wall.sectorId === sector.id),
      })),
  }));
}

export async function getRouteEditor(routeId: string) {
  const route = await db
    .select()
    .from(routes)
    .where(eq(routes.id, routeId))
    .then((rows) => rows[0] ?? null);
  if (!route) return null;
  const context = await getWallById(route.wallId);
  if (!context) return null;
  const wallTopos = await db
    .select()
    .from(topos)
    .where(eq(topos.wallId, route.wallId))
    .orderBy(asc(topos.position));
  const paths = await db
    .select()
    .from(routePaths)
    .where(eq(routePaths.routeId, route.id));
  return { route, ...context, topos: wallTopos, paths };
}
