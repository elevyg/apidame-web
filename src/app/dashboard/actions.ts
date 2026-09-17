"use server";

import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { auth, isAdminEmail } from "@/auth";
import { db } from "@/db/client";
import { routePaths, routes, sectors, topos, zones } from "@/db/schema";
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

export async function updateRoute(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim();
  const kind = String(formData.get("kind") ?? "Sport").trim();
  const description = String(formData.get("description") ?? "").trim();
  const position = Number(formData.get("position") ?? 0);
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
      grade: grade || null,
      kind,
      description: description || null,
      position: Number.isFinite(position) ? position : 0,
    })
    .where(eq(routes.id, id));
  await refreshPdfsForWall(current.wallId);
  revalidateGuide();
}

export async function createRoute(formData: FormData) {
  await requireAdmin();
  const wallId = String(formData.get("wallId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim();
  const kind = String(formData.get("kind") ?? "Sport").trim();
  const position = Number(formData.get("position") ?? 0);
  if (!wallId || !name) throw new Error("Falta el nombre de la ruta");
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  await db.insert(routes).values({
    id: crypto.randomUUID(),
    wallId,
    name,
    slug: slug || crypto.randomUUID(),
    grade: grade || null,
    kind,
    position: Number.isFinite(position) ? position : 0,
  });
  await refreshPdfsForWall(wallId);
  revalidateGuide();
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
    await db
      .update(routePaths)
      .set({ path })
      .where(eq(routePaths.id, pathId));
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
}

export async function updateTopoMeta(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const main = formData.get("main") === "on";
  if (!id) throw new Error("Falta el topo");
  const topo = await db
    .select({ wallId: topos.wallId })
    .from(topos)
    .where(eq(topos.id, id))
    .then((rows) => rows[0] ?? null);
  if (!topo) throw new Error("Topo no encontrado");
  await db
    .update(topos)
    .set({ name: name || null, main })
    .where(eq(topos.id, id));
  await refreshPdfsForWall(topo.wallId);
  revalidateGuide();
}
