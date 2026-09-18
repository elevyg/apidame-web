"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import {
  agreements,
  routePaths,
  routes,
  sectors,
  topos,
  users,
  walls,
  zoneAgreements,
  zoneRoles,
  zones,
} from "@/db/schema";
import {
  FRENCH_GRADE_SYSTEM,
  toFrenchGrade,
} from "@/lib/climbing/frenchGrade";
import { imageFromAdminForm } from "@/lib/climbing/cloudinary";
import {
  parseZoneRole,
  requireOwnedAction,
  requireSuperAdmin,
  requireZoneAction,
  zoneIdForRoute,
  zoneIdForTopo,
  zoneIdForWall,
} from "@/lib/guide/authz";
import { canAssignPlatformAdmin } from "@/lib/guide/platformAccess";
import { guideSlug } from "@/lib/guide/slug";
import { refreshPdfsForWall, refreshZoneCover } from "@/lib/guide/store";
import {
  moveSectorId,
  rankNorthToSouth,
  sortSectors,
} from "@/lib/guide/sectorOrder";
import { findOrCreateUserByEmail } from "@/db/seed";

function revalidateGuide(zoneSlug?: string) {
  revalidatePath("/deportiva");
  revalidatePath("/dashboard");
  if (zoneSlug) {
    revalidatePath(`/deportiva/${zoneSlug}`);
    revalidatePath(`/dashboard/zonas`);
  }
}

async function slugForZoneId(zoneId: string) {
  const zone = await db
    .select({ slug: zones.slug })
    .from(zones)
    .where(eq(zones.id, zoneId))
    .then((rows) => rows[0] ?? null);
  return zone?.slug;
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
  const zoneId = String(formData.get("zoneId") ?? "");
  const sectorId = String(formData.get("sectorId") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!zoneId || !sectorId || (direction !== "up" && direction !== "down")) {
    throw new Error("No se pudo mover el sector");
  }
  await requireZoneAction(zoneId, "editZone");
  const rows = await sectorIdsForZone(zoneId);
  const next = moveSectorId(
    rows.map((row) => row.id),
    sectorId,
    direction,
  );
  await writeSectorOrder(zoneId, next);
}

export async function orderSectorsNorthToSouth(formData: FormData) {
  const zoneId = String(formData.get("zoneId") ?? "");
  if (!zoneId) throw new Error("Falta la zona");
  await requireZoneAction(zoneId, "editZone");
  const rows = await sectorIdsForZone(zoneId);
  await writeSectorOrder(zoneId, rankNorthToSouth(rows), true);
}

async function uniqueChildSlug(existing: string[], name: string) {
  const base = guideSlug(name);
  if (!existing.includes(base)) return base;
  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

function clampStroke(value: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(3, Math.max(0.2, Math.round(value * 20) / 20));
}

function parseStars(formData: FormData) {
  const countRaw = String(formData.get("starCount") ?? "").trim();
  const averageRaw = String(formData.get("starAverage") ?? "").trim();
  const starCount = countRaw === "" ? 0 : Math.floor(Number(countRaw));
  if (!Number.isFinite(starCount) || starCount < 0) {
    throw new Error("La cantidad de estrellas no calza");
  }
  if (starCount === 0) return { starCount: 0, starAverage: null as number | null };
  const starAverage = Number(averageRaw);
  if (!Number.isFinite(starAverage)) {
    throw new Error("Falta el promedio de estrellas");
  }
  return {
    starCount,
    starAverage: Math.min(5, Math.max(0, starAverage)),
  };
}

function parseLength(formData: FormData) {
  const lengthRaw = String(formData.get("length") ?? "").trim();
  const unitRaw = String(formData.get("lengthUnit") ?? "").trim();
  if (!lengthRaw) return { length: null as number | null, lengthUnit: null as string | null };
  const length = Number(lengthRaw);
  if (!Number.isFinite(length) || length <= 0) {
    throw new Error("El largo no calza");
  }
  return {
    length,
    lengthUnit: unitRaw === "Feet" ? "Feet" : "Metric",
  };
}

const AGREEMENT_LEVELS = ["Critical", "Important", "Recommended"] as const;

function parseAgreementLevel(value: string) {
  if (!AGREEMENT_LEVELS.includes(value as (typeof AGREEMENT_LEVELS)[number])) {
    throw new Error("Nivel inválido");
  }
  return value;
}

export async function updateZone(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const published = formData.get("published") === "on";
  if (!id || !name) throw new Error("Falta el nombre de la zona");
  await requireZoneAction(id, "editZone");
  const cover = await imageFromAdminForm(formData, "apidame/guia/covers");
  await db
    .update(zones)
    .set({
      name,
      description: description || null,
      published,
      updatedAt: new Date(),
      ...(cover
        ? {
            coverImageUrl: cover.url,
            coverPublicId: cover.publicId,
            coverImageWidth: cover.width,
            coverImageHeight: cover.height,
          }
        : {}),
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
  const zoneId = String(formData.get("zoneId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!zoneId || !name) throw new Error("Falta el sector");
  const { actor } = await requireZoneAction(zoneId, "create");
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
    createdByUserId: actor.id,
  });
  await refreshZoneCover(zoneId);
  revalidateGuide();
  redirect(`/dashboard/zonas/${zoneId}#sector-${id}`);
}

export async function createWall(formData: FormData) {
  const sectorId = String(formData.get("sectorId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!sectorId || !name) throw new Error("Falta la pared");
  const sector = await db
    .select({ zoneId: sectors.zoneId })
    .from(sectors)
    .where(eq(sectors.id, sectorId))
    .then((rows) => rows[0] ?? null);
  if (!sector) throw new Error("Sector no encontrado");
  const { actor } = await requireZoneAction(sector.zoneId, "create");
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
    createdByUserId: actor.id,
  });
  await refreshZoneCover(sector.zoneId);
  revalidateGuide();
  redirect(`/dashboard/paredes/${id}`);
}

export async function updateRoute(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim();
  const kind = String(formData.get("kind") ?? "Sport").trim();
  const description = String(formData.get("description") ?? "").trim();
  const position = Number(formData.get("position") ?? 0);
  const frenchGrade = toFrenchGrade(grade || null);
  if (!id || !name) throw new Error("Falta el nombre de la ruta");
  const current = await db
    .select({ wallId: routes.wallId, createdByUserId: routes.createdByUserId })
    .from(routes)
    .where(eq(routes.id, id))
    .then((rows) => rows[0] ?? null);
  if (!current) throw new Error("Ruta no encontrada");
  const zoneId = await zoneIdForRoute(id);
  await requireOwnedAction(zoneId, "update", current.createdByUserId);
  const stars = parseStars(formData);
  const length = parseLength(formData);
  await db
    .update(routes)
    .set({
      name,
      grade: frenchGrade,
      gradeSystem: frenchGrade ? FRENCH_GRADE_SYSTEM : null,
      kind,
      description: description || null,
      position: Number.isFinite(position) ? position : 0,
      starCount: stars.starCount,
      starAverage: stars.starAverage,
      length: length.length,
      lengthUnit: length.lengthUnit,
    })
    .where(eq(routes.id, id));
  await refreshPdfsForWall(current.wallId);
  revalidateGuide(await slugForZoneId(zoneId));
  revalidatePath(`/dashboard/rutas/${id}`);
}

export async function createRoute(formData: FormData) {
  const wallId = String(formData.get("wallId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim();
  const kind = String(formData.get("kind") ?? "Sport").trim();
  const position = Number(formData.get("position") ?? 0);
  const frenchGrade = toFrenchGrade(grade || null);
  if (!wallId || !name) throw new Error("Falta el nombre de la ruta");
  const zoneId = await zoneIdForWall(wallId);
  const { actor } = await requireZoneAction(zoneId, "create");
  const stars = parseStars(formData);
  const length = parseLength(formData);
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
    starCount: stars.starCount,
    starAverage: stars.starAverage,
    length: length.length,
    lengthUnit: length.lengthUnit,
    createdByUserId: actor.id,
  });
  await refreshPdfsForWall(wallId);
  revalidateGuide(await slugForZoneId(zoneId));
  redirect(`/dashboard/rutas/${id}`);
}

export async function saveRoutePath(formData: FormData) {
  const topoId = String(formData.get("topoId") ?? "");
  const routeId = String(formData.get("routeId") ?? "");
  const path = String(formData.get("path") ?? "").trim();
  const pathId = String(formData.get("pathId") ?? "");
  if (!topoId || !routeId || !path) throw new Error("Falta la línea");
  const route = await db
    .select({ wallId: routes.wallId, createdByUserId: routes.createdByUserId })
    .from(routes)
    .where(eq(routes.id, routeId))
    .then((rows) => rows[0] ?? null);
  if (!route) throw new Error("Ruta no encontrada");
  const zoneId = await zoneIdForWall(route.wallId);
  await requireOwnedAction(zoneId, "update", route.createdByUserId);
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
  const wallId = String(formData.get("wallId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const image = await imageFromAdminForm(formData, "apidame/guia/topos");
  const main = formData.get("main") === "on";
  if (!wallId || !image) throw new Error("Falta la foto del topo");
  const zoneId = await zoneIdForWall(wallId);
  const { actor } = await requireZoneAction(zoneId, "create");
  const siblings = await db
    .select({ slug: topos.slug, position: topos.position })
    .from(topos)
    .where(eq(topos.wallId, wallId));
  const id = crypto.randomUUID();
  const asMain = siblings.length === 0 ? true : main;
  if (main && siblings.length > 0) {
    await requireZoneAction(zoneId, "setMainTopo");
    await db.update(topos).set({ main: false }).where(eq(topos.wallId, wallId));
  } else if (asMain) {
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
    main: asMain,
    imageUrl: image.url,
    imagePublicId: image.publicId,
    imageWidth: image.width,
    imageHeight: image.height,
    createdByUserId: actor.id,
  });
  await refreshPdfsForWall(wallId);
  revalidateGuide();
  redirect(`/dashboard/topos/${id}`);
}

export async function updateTopoMeta(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const main = formData.get("main") === "on";
  const image = await imageFromAdminForm(formData, "apidame/guia/topos");
  if (!id) throw new Error("Falta el topo");
  const topo = await db
    .select()
    .from(topos)
    .where(eq(topos.id, id))
    .then((rows) => rows[0] ?? null);
  if (!topo) throw new Error("Topo no encontrado");
  const zoneId = await zoneIdForTopo(id);
  await requireOwnedAction(zoneId, "update", topo.createdByUserId);
  const nextMain = formData.has("setMain") ? main : topo.main;
  if (nextMain !== topo.main) {
    await requireZoneAction(zoneId, "setMainTopo");
    if (nextMain) {
      await db
        .update(topos)
        .set({ main: false })
        .where(and(eq(topos.wallId, topo.wallId)));
    }
  }
  await db
    .update(topos)
    .set({
      name: name || null,
      main: nextMain,
      routeStrokeWidth: clampStroke(
        Number(formData.get("routeStrokeWidth")),
        topo.routeStrokeWidth,
      ),
      ...(image
        ? {
            imageUrl: image.url,
            imagePublicId: image.publicId,
            imageWidth: image.width,
            imageHeight: image.height,
          }
        : {}),
    })
    .where(eq(topos.id, id));
  await refreshPdfsForWall(topo.wallId);
  revalidateGuide(await slugForZoneId(zoneId));
  revalidatePath(`/dashboard/topos/${id}`);
  revalidatePath(`/dashboard/paredes/${topo.wallId}`);
}

export async function assignZoneRole(formData: FormData) {
  const zoneId = String(formData.get("zoneId") ?? "");
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const role = parseZoneRole(String(formData.get("role") ?? ""));
  if (!zoneId || !email) throw new Error("Falta el correo");
  const { actor } = await requireZoneAction(zoneId, "assignRole");
  const saved = await findOrCreateUserByEmail(email);
  const existing = await db
    .select()
    .from(zoneRoles)
    .where(and(eq(zoneRoles.userId, saved.id), eq(zoneRoles.zoneId, zoneId)))
    .then((rows) => rows[0] ?? null);
  if (existing) {
    await db
      .update(zoneRoles)
      .set({ role, assignedByUserId: actor.id })
      .where(eq(zoneRoles.id, existing.id));
  } else {
    await db.insert(zoneRoles).values({
      id: crypto.randomUUID(),
      userId: saved.id,
      zoneId,
      role,
      assignedByUserId: actor.id,
    });
  }
  revalidatePath(`/dashboard/zonas/${zoneId}`);
}

export async function removeZoneRole(formData: FormData) {
  const zoneId = String(formData.get("zoneId") ?? "");
  const userId = String(formData.get("userId") ?? "");
  if (!zoneId || !userId) throw new Error("Falta el miembro");
  await requireZoneAction(zoneId, "assignRole");
  await db
    .delete(zoneRoles)
    .where(and(eq(zoneRoles.zoneId, zoneId), eq(zoneRoles.userId, userId)));
  revalidatePath(`/dashboard/zonas/${zoneId}`);
}

export async function setPlatformAdmin(formData: FormData) {
  const actor = await requireSuperAdmin();
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!userId || (role !== "admin" && role !== "user")) {
    throw new Error("Falta el usuario");
  }
  const target = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .then((rows) => rows[0] ?? null);
  if (!target) throw new Error("Usuario no encontrado");
  if (!canAssignPlatformAdmin(actor, target.email)) {
    throw new Error("No autorizado");
  }
  await db.update(users).set({ role }).where(eq(users.id, userId));
  revalidatePath("/dashboard");
}

export async function invitePlatformAdmin(formData: FormData) {
  const actor = await requireSuperAdmin();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email) throw new Error("Falta el correo");
  if (!canAssignPlatformAdmin(actor, email)) {
    throw new Error("No autorizado");
  }
  const saved = await findOrCreateUserByEmail(email);
  await db.update(users).set({ role: "admin" }).where(eq(users.id, saved.id));
  revalidatePath("/dashboard");
}

async function refreshZoneGuide(zoneId: string) {
  await refreshZoneCover(zoneId);
  revalidateGuide(await slugForZoneId(zoneId));
  revalidatePath(`/dashboard/zonas/${zoneId}`);
}

export async function addZoneAgreement(formData: FormData) {
  const zoneId = String(formData.get("zoneId") ?? "");
  const agreementId = String(formData.get("agreementId") ?? "");
  const level = parseAgreementLevel(
    String(formData.get("level") ?? "Recommended"),
  );
  const comment = String(formData.get("comment") ?? "").trim();
  if (!zoneId || !agreementId) throw new Error("Falta el acuerdo");
  await requireZoneAction(zoneId, "editZone");
  const already = await db
    .select({ id: zoneAgreements.id })
    .from(zoneAgreements)
    .where(
      and(
        eq(zoneAgreements.zoneId, zoneId),
        eq(zoneAgreements.agreementId, agreementId),
      ),
    )
    .then((rows) => rows[0] ?? null);
  if (already) throw new Error("Ese acuerdo ya está en la zona");
  const siblings = await db
    .select({ position: zoneAgreements.position })
    .from(zoneAgreements)
    .where(eq(zoneAgreements.zoneId, zoneId));
  await db.insert(zoneAgreements).values({
    id: crypto.randomUUID(),
    zoneId,
    agreementId,
    level,
    comment: comment || null,
    position: siblings.reduce((max, row) => Math.max(max, row.position), 0) + 1,
  });
  await refreshZoneGuide(zoneId);
}

export async function updateZoneAgreement(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const zoneId = String(formData.get("zoneId") ?? "");
  const level = parseAgreementLevel(String(formData.get("level") ?? ""));
  const comment = String(formData.get("comment") ?? "").trim();
  const position = Number(formData.get("position") ?? 0);
  if (!id || !zoneId) throw new Error("Falta el acuerdo");
  await requireZoneAction(zoneId, "editZone");
  await db
    .update(zoneAgreements)
    .set({
      level,
      comment: comment || null,
      position: Number.isFinite(position) ? position : 0,
    })
    .where(and(eq(zoneAgreements.id, id), eq(zoneAgreements.zoneId, zoneId)));
  await refreshZoneGuide(zoneId);
}

export async function removeZoneAgreement(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const zoneId = String(formData.get("zoneId") ?? "");
  if (!id || !zoneId) throw new Error("Falta el acuerdo");
  await requireZoneAction(zoneId, "editZone");
  await db
    .delete(zoneAgreements)
    .where(and(eq(zoneAgreements.id, id), eq(zoneAgreements.zoneId, zoneId)));
  await refreshZoneGuide(zoneId);
}

export async function createAgreement(formData: FormData) {
  const zoneId = String(formData.get("zoneId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim();
  const classic = String(formData.get("classic") ?? "").trim();
  if (!zoneId || !title || !description) throw new Error("Falta el acuerdo");
  await requireZoneAction(zoneId, "editZone");
  await db.insert(agreements).values({
    id: crypto.randomUUID(),
    title,
    description,
    icon: icon || null,
    classic: classic || null,
  });
  revalidatePath(`/dashboard/zonas/${zoneId}`);
}
