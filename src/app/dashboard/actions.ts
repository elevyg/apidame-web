"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth, isAdminEmail } from "@/auth";
import { db } from "@/db/client";
import { routePaths, routes, topos, zones } from "@/db/schema";
import { refreshPdfsForWall, refreshZoneCover } from "@/lib/guide/store";

async function requireAdmin() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !isAdminEmail(email)) {
    throw new Error("No autorizado");
  }
  return session;
}

function revalidateGuide() {
  revalidatePath("/deportiva");
  revalidatePath("/dashboard");
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
  await refreshZoneCover(id);
  revalidateGuide();
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
