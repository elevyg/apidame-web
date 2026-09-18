import { isAdminEmail } from "./adminEmail";

export function storedUserRole(
  email: string,
  current: string | null | undefined,
): "admin" | "user" {
  if (isAdminEmail(email)) return "admin";
  return current === "admin" ? "admin" : "user";
}

export function canAssignPlatformAdmin(
  actor: { superAdmin: boolean },
  targetEmail: string,
) {
  return actor.superAdmin && !isAdminEmail(targetEmail);
}
