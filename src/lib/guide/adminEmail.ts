export const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL ?? "elevyg91@gmail.com"
).toLowerCase();

export function isAdminEmail(email: string | null | undefined): boolean {
  return email?.toLowerCase() === ADMIN_EMAIL;
}
