"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { auth, isAdminEmail } from "@/auth";
import { db } from "@/db/client";
import { routePaths, routes, sectors, topos, walls, zones } from "@/db/schema";
import {
  FRENCH_GRADE_SYSTEM,
  toFrenchGrade,
} from "@/lib/climbing/frenchGrade";
import { guideSlug } from "@/lib/guide/slug";
import { refreshPdfsForWall, refreshZoneCover } from "@/lib/guide/store";
import {
  moveSectorId,
  rankNorthToSouth,
  sortSectors,
} from "@/lib/guide/sectorOrder";

async function requireAdmin() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !isAdminEmail(email)) {
    throw new Error("No autorizado");
  }
  return session;
}

function revalidateGuide(zoneSlug?: string) {
  revalidatePath("/deportiva");
  revalidatePath("/dashboard");
  if (zoneSlug) {
    revalidatePath(`/deportiva/${zoneSlug}`);
    revalidatePath(`/dashboard/zonas`);
  }
}

async function writeSectorOrder(
  zoneId: string,
  orderedIds: string[],
  refreshPdf = false,
) {
  const zone = await db
    .select({ slug: zones.slug })
    .from(zones)
    .where(eq(zones.id, zoneId))
    .then((rows) => rows[0] ?? null);
  if (!zone) throw new Error("Zona no encontrada");

  for (const [index, id] of orderedIds.entries()) {
    await db
      .update(sectors)
      .set({ position: index + 1 })
      .where(eq(sectors.id, id));
  }
  if (refreshPdf) await refreshZoneCover(zoneId);
  revalidateGuide(zone.slug);
  revalidatePath(`/dashboard/zonas/${zoneId}`);
}

async function sectorIdsForZone(zoneId: string) {
  const rows = await db
    .select()
    .from(sectors)
    .where(eq(sectors.zoneId, zoneId))
    .orderBy(asc(sectors.position), asc(sectors.name));
  return sortSectors(rows);
}

export async function moveSector(formData: FormData) {
  await requireAdmin();
  const zoneId = String(formData.get("zoneId") ?? "");
  const sectorId = String(formData.get("sectorId") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!zoneId || !sectorId || (direction !== "up" && direction !== "down")) {
    throw new Error("No se pudo mover el sector");
  }
  const rows = await sectorIdsForZone(zoneId);
  const next = moveSectorId(
    rows.map((row) => row.id),
    sectorId,
    direction,
  );
  await writeSectorOrder(zoneId, next);
}

export async function orderSectorsNorthToSouth(formData: FormData) {
  await requireAdmin();
  const zoneId = String(formData.get("zoneId") ?? "");
  if (!zoneId) throw new Error("Falta la zona");
  const rows = await sectorIdsForZone(zoneId);
  await writeSectorOrder(zoneId, rankNorthToSouth(rows), true);
}

async function uniqueChildSlug(
  existing: string[],
  name: string,
) {
  const base = guideSlug(name);
  if (!existing.includes(base)) return base;
  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

export async function updateZone(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const published = formData.get("published") === "on";
  if (!id || !name) throw new Error("Falta el nombre de la zona");
  await db
    .update(zones)
    .set({
      name,
      description: description || null,
      published,
      updatedAt: new Date(),
    })
    .where(eq(zones.id, id));
  const zone = await db
    .select({ slug: zones.slug })
    .from(zones)
    .where(eq(zones.id, id))
    .then((rows) => rows[0] ?? null);
  await refreshZoneCover(id);
  revalidateGuide(zone?.slug);
}

export async function createSector(formData: FormData) {
  await requireAdmin();
  const zoneId = String(formData.get("zoneId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!zoneId || !name) throw new Error("Falta el sector");
  const siblings = await db
    .select({ slug: sectors.slug, position: sectors.position })
    .from(sectors)
    .where(eq(sectors.zoneId, zoneId));
  const id = crypto.randomUUID();
  await db.insert(sectors).values({
    id,
    zoneId,
    name,
    slug: await uniqueChildSlug(
      siblings.map((row) => row.slug),
      name,
    ),
    position: siblings.reduce((max, row) => Math.max(max, row.position), 0) + 1,
  });
  await refreshZoneCover(zoneId);
  revalidateGuide();
  redirect(`/dashboard/zonas/${zoneId}#sector-${id}`);
}

export async function createWall(formData: FormData) {
  await requireAdmin();
  const sectorId = String(formData.get("sectorId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!sectorId || !name) throw new Error("Falta la pared");
  const sector = await db
    .select({ zoneId: sectors.zoneId })
    .from(sectors)
    .where(eq(sectors.id, sectorId))
    .then((rows) => rows[0] ?? null);
  if (!sector) throw new Error("Sector no encontrado");
  const siblings = await db
    .select({ slug: walls.slug, position: walls.position })
    .from(walls)
    .where(eq(walls.sectorId, sectorId));
  const id = crypto.randomUUID();
  await db.insert(walls).values({
    id,
    sectorId,
    name,
    slug: await uniqueChildSlug(
      siblings.map((row) => row.slug),
      name,
    ),
    position: siblings.reduce((max, row) => Math.max(max, row.position), 0) + 1,
  });
  await refreshZoneCover(sector.zoneId);
  revalidateGuide();
  redirect(`/dashboard/paredes/${id}`);
}

export async function updateRoute(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim();
  const kind = String(formData.get("kind") ?? "Sport").trim();
  const description = String(formData.get("description") ?? "").trim();
  const position = Number(formData.get("position") ?? 0);
  const frenchGrade = toFrenchGrade(grade || null);
  if (!id || !name) throw new Error("Falta el nombre de la ruta");
  const current = await db
    .select({ wallId: routes.wallId })
    .from(routes)
    .where(eq(routes.id, id))
    .then((rows) => rows[0] ?? null);
  if (!current) throw new Error("Ruta no encontrada");
  await db
    .update(routes)
    .set({
      name,
      grade: frenchGrade,
      gradeSystem: frenchGrade ? FRENCH_GRADE_SYSTEM : null,
      kind,
      description: description || null,
      position: Number.isFinite(position) ? position : 0,
    })
    .where(eq(routes.id, id));
  await refreshPdfsForWall(current.wallId);
  revalidateGuide();
  revalidatePath(`/dashboard/rutas/${id}`);
}

export async function createRoute(formData: FormData) {
  await requireAdmin();
  const wallId = String(formData.get("wallId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim();
  const kind = String(formData.get("kind") ?? "Sport").trim();
  const position = Number(formData.get("position") ?? 0);
  const frenchGrade = toFrenchGrade(grade || null);
  if (!wallId || !name) throw new Error("Falta el nombre de la ruta");
  const siblings = await db
    .select({ slug: routes.slug, position: routes.position })
    .from(routes)
    .where(eq(routes.wallId, wallId));
  const id = crypto.randomUUID();
  await db.insert(routes).values({
    id,
    wallId,
    name,
    slug: await uniqueChildSlug(
      siblings.map((row) => row.slug),
      name,
    ),
    grade: frenchGrade,
    gradeSystem: frenchGrade ? FRENCH_GRADE_SYSTEM : null,
    kind,
    position: Number.isFinite(position)
      ? position
      : siblings.reduce((max, row) => Math.max(max, row.position), 0) + 1,
  });
  await refreshPdfsForWall(wallId);
  revalidateGuide();
  redirect(`/dashboard/rutas/${id}`);
}

export async function saveRoutePath(formData: FormData) {
  await requireAdmin();
  const topoId = String(formData.get("topoId") ?? "");
  const routeId = String(formData.get("routeId") ?? "");
  const path = String(formData.get("path") ?? "").trim();
  const pathId = String(formData.get("pathId") ?? "");
  if (!topoId || !routeId || !path) throw new Error("Falta la línea");
  const topo = await db
    .select({ wallId: topos.wallId })
    .from(topos)
    .where(eq(topos.id, topoId))
    .then((rows) => rows[0] ?? null);
  if (!topo) throw new Error("Topo no encontrado");

  if (pathId) {
    await db.update(routePaths).set({ path }).where(eq(routePaths.id, pathId));
  } else {
    await db.insert(routePaths).values({
      id: crypto.randomUUID(),
      topoId,
      routeId,
      path,
    });
  }
  await refreshPdfsForWall(topo.wallId);
  revalidateGuide();
  revalidatePath(`/dashboard/rutas/${routeId}`);
  revalidatePath(`/dashboard/topos/${topoId}`);
}

export async function createTopo(formData: FormData) {
  await requireAdmin();
  const wallId = String(formData.get("wallId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const imagePublicId = String(formData.get("imagePublicId") ?? "").trim();
  const imageWidth = Number(formData.get("imageWidth") ?? 0);
  const imageHeight = Number(formData.get("imageHeight") ?? 0);
  const main = formData.get("main") === "on";
  if (!wallId || !imageUrl) throw new Error("Falta la foto del topo");
  if (!/^https?:\/\//i.test(imageUrl)) {
    throw new Error("La foto tiene que ser una URL http");
  }
  const siblings = await db
    .select({ slug: topos.slug, position: topos.position })
    .from(topos)
    .where(eq(topos.wallId, wallId));
  const id = crypto.randomUUID();
  if (main) {
    await db.update(topos).set({ main: false }).where(eq(topos.wallId, wallId));
  }
  await db.insert(topos).values({
    id,
    wallId,
    name: name || null,
    slug: await uniqueChildSlug(
      siblings.map((row) => row.slug),
      name || "topo",
    ),
    position: siblings.reduce((max, row) => Math.max(max, row.position), 0) + 1,
    main: main || siblings.length === 0,
    imageUrl,
    imagePublicId: imagePublicId || null,
    imageWidth: Number.isFinite(imageWidth) && imageWidth > 0 ? imageWidth : null,
    imageHeight:
      Number.isFinite(imageHeight) && imageHeight > 0 ? imageHeight : null,
  });
  await refreshPdfsForWall(wallId);
  revalidateGuide();
  redirect(`/dashboard/topos/${id}`);
}

export async function updateTopoMeta(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const main = formData.get("main") === "on";
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  if (!id) throw new Error("Falta el topo");
  const topo = await db
    .select()
    .from(topos)
    .where(eq(topos.id, id))
    .then((rows) => rows[0] ?? null);
  if (!topo) throw new Error("Topo no encontrado");
  if (main) {
    await db
      .update(topos)
      .set({ main: false })
      .where(and(eq(topos.wallId, topo.wallId)));
  }
  await db
    .update(topos)
    .set({
      name: name || null,
      main,
      ...(imageUrl && /^https?:\/\//i.test(imageUrl)
        ? { imageUrl }
        : {}),
    })
    .where(eq(topos.id, id));
  await refreshPdfsForWall(topo.wallId);
  revalidateGuide();
  revalidatePath(`/dashboard/topos/${id}`);
  revalidatePath(`/dashboard/paredes/${topo.wallId}`);
}
