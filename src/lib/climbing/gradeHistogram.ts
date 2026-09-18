import { toFrenchGrade } from "./frenchGrade";

export const GRADE_BANDS = [
  { key: 5, label: "5tos" },
  { key: 6, label: "6tos" },
  { key: 7, label: "7mos" },
  { key: 8, label: "8vos" },
] as const;

export type GradeBandKey = (typeof GRADE_BANDS)[number]["key"];

export function frenchGradeBand(
  grade: string | null | undefined,
  system?: string | null,
): GradeBandKey | null {
  const french = toFrenchGrade(grade, system);
  if (!french) return null;
  const n = Number(french[0]);
  if (n === 5 || n === 6 || n === 7 || n === 8) return n;
  return null;
}

export function gradeHistogram(
  routes: Array<{ grade: string | null; gradeSystem?: string | null }>,
) {
  const counts: Record<GradeBandKey, number> = { 5: 0, 6: 0, 7: 0, 8: 0 };
  for (const route of routes) {
    const band = frenchGradeBand(route.grade, route.gradeSystem);
    if (band) counts[band] += 1;
  }
  const total = GRADE_BANDS.reduce((sum, band) => sum + counts[band.key], 0);
  const max = Math.max(...GRADE_BANDS.map((band) => counts[band.key]), 0);
  return {
    total,
    bands: GRADE_BANDS.map((band) => ({
      key: band.key,
      label: band.label,
      count: counts[band.key],
      ratio: max === 0 ? 0 : counts[band.key] / max,
    })),
  };
}
