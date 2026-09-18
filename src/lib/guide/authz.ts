import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/guide/adminEmail";
import { db } from "@/db/client";
import { routes, sectors, topos, users, walls, zoneRoles } from "@/db/schema";
import {
  canMutateOwned,
  hasZoneAction,
  isZoneRole,
  type ZoneAccess,
  type ZoneAction,
  type ZoneRole,
} from "./zoneAccess";

export type Actor = {
  id: string;
  email: string;
  superAdmin: boolean;
  platformAdmin: boolean;
};

export async function requireActor(): Promise<Actor> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) throw new Error("No autenticado");
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then((rows) => rows[0] ?? null);
  if (!user) throw new Error("No autenticado");
  const superAdmin = isAdminEmail(email);
  return {
    id: user.id,
    email: user.email,
    superAdmin,
    platformAdmin: superAdmin || user.role === "admin",
  };
}

export async function requireSuperAdmin() {
  const actor = await requireActor();
  if (!actor.superAdmin) throw new Error("No autorizado");
  return actor;
}

export async function loadZoneAccess(
  actor: Actor,
  zoneId: string,
): Promise<ZoneAccess> {
  if (actor.platformAdmin) {
    return { platformAdmin: true, role: null, userId: actor.id };
  }
  const membership = await db
    .select()
    .from(zoneRoles)
    .where(and(eq(zoneRoles.userId, actor.id), eq(zoneRoles.zoneId, zoneId)))
    .then((rows) => rows[0] ?? null);
  return {
    platformAdmin: false,
    role: membership && isZoneRole(membership.role) ? membership.role : null,
    userId: actor.id,
  };
}

export async function requireZoneAction(zoneId: string, action: ZoneAction) {
  const actor = await requireActor();
  const access = await loadZoneAccess(actor, zoneId);
  if (!hasZoneAction(access, action)) {
    throw new Error("No autorizado");
  }
  return { actor, access };
}

export async function requireOwnedAction(
  zoneId: string,
  action: "update" | "delete",
  ownerId: string | null,
) {
  const actor = await requireActor();
  const access = await loadZoneAccess(actor, zoneId);
  if (!canMutateOwned(access, action, ownerId)) {
    throw new Error("No autorizado");
  }
  return { actor, access };
}

export async function requireZoneView(zoneId: string) {
  const actor = await requireActor();
  const access = await loadZoneAccess(actor, zoneId);
  if (!access.platformAdmin && !access.role) {
    throw new Error("No autorizado");
  }
  return { actor, access };
}

export async function zoneIdForWall(wallId: string) {
  const wall = await db
    .select({ sectorId: walls.sectorId })
    .from(walls)
    .where(eq(walls.id, wallId))
    .then((rows) => rows[0] ?? null);
  if (!wall) throw new Error("Pared no encontrada");
  const sector = await db
    .select({ zoneId: sectors.zoneId })
    .from(sectors)
    .where(eq(sectors.id, wall.sectorId))
    .then((rows) => rows[0] ?? null);
  if (!sector) throw new Error("Sector no encontrado");
  return sector.zoneId;
}

export async function zoneIdForRoute(routeId: string) {
  const route = await db
    .select({ wallId: routes.wallId })
    .from(routes)
    .where(eq(routes.id, routeId))
    .then((rows) => rows[0] ?? null);
  if (!route) throw new Error("Ruta no encontrada");
  return zoneIdForWall(route.wallId);
}

export async function zoneIdForTopo(topoId: string) {
  const topo = await db
    .select({ wallId: topos.wallId })
    .from(topos)
    .where(eq(topos.id, topoId))
    .then((rows) => rows[0] ?? null);
  if (!topo) throw new Error("Topo no encontrado");
  return zoneIdForWall(topo.wallId);
}

export async function actorZoneIds(actor: Actor) {
  if (actor.platformAdmin) return null;
  const rows = await db
    .select({ zoneId: zoneRoles.zoneId })
    .from(zoneRoles)
    .where(eq(zoneRoles.userId, actor.id));
  return rows.map((row) => row.zoneId);
}

export function parseZoneRole(value: string): ZoneRole {
  if (!isZoneRole(value)) throw new Error("Rol inválido");
  return value;
}
