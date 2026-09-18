export const ZONE_ROLES = ["collaborator", "editor", "admin"] as const;

export type ZoneRole = (typeof ZONE_ROLES)[number];

export type ZoneAction =
  | "create"
  | "update"
  | "delete"
  | "editZone"
  | "setMainTopo"
  | "assignRole";

export const ROLE_ACTIONS: Record<ZoneRole, readonly ZoneAction[]> = {
  collaborator: ["create"],
  editor: ["create", "update", "delete"],
  admin: [
    "create",
    "update",
    "delete",
    "editZone",
    "setMainTopo",
    "assignRole",
  ],
};

export const ROLE_LABEL: Record<ZoneRole, string> = {
  admin: "Administrador",
  editor: "Editor",
  collaborator: "Colaborador",
};

export const ROLE_HELP: Record<ZoneRole, string> = {
  collaborator:
    "Crea sectores, paredes, rutas y topos. Solo puede editar o borrar lo que creó.",
  editor:
    "Crea y corrige cualquier contenido de la zona. No toca la ficha de la zona, el topo principal ni el equipo.",
  admin:
    "Todo lo del editor, más publicar la zona, marcar el topo principal y asignar roles.",
};

export type ZoneAccess = {
  platformAdmin: boolean;
  role: ZoneRole | null;
  userId: string;
};

export function isZoneRole(value: string): value is ZoneRole {
  return (ZONE_ROLES as readonly string[]).includes(value);
}

export function hasZoneAction(access: ZoneAccess, action: ZoneAction) {
  if (access.platformAdmin) return true;
  if (!access.role) return false;
  return ROLE_ACTIONS[access.role].includes(action);
}

export function canMutateOwned(
  access: ZoneAccess,
  action: "update" | "delete",
  ownerId: string | null,
) {
  if (hasZoneAction(access, action)) return true;
  return hasZoneAction(access, "create") && ownerId === access.userId;
}
