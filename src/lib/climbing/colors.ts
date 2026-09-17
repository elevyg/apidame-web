import { toFrenchGrade } from "./frenchGrade";

export const KIND_COLORS: Record<string, string> = {
  Sport: "#E11845",
  Trad: "#F2CA19",
  Boulder: "#E11845",
  Mixed: "#FF00BD",
  Ice: "#0057E9",
  Aid: "#8931EF",
};

export const KIND_LABELS: Record<string, string> = {
  Sport: "Deportiva",
  Trad: "Tradicional",
  Boulder: "Boulder",
  Mixed: "Mixto",
  Ice: "Hielo",
  Aid: "Artificial",
};

export const SELECTED_COLOR = "#87E911";
export const DIMMED_COLOR = "rgba(28, 25, 22, 0.28)";

export function routeColor(kind: string): string {
  return KIND_COLORS[kind] ?? "#E11845";
}

export function routeKindLabel(kind: string): string {
  return KIND_LABELS[kind] ?? kind;
}

export function routeMeta(route: {
  kind: string;
  grade: string | null;
  gradeSystem?: string | null;
  length: number | null;
  lengthUnit: string | null;
}): string {
  const parts = [routeKindLabel(route.kind)];
  const grade = toFrenchGrade(route.grade, route.gradeSystem);
  if (grade) {
    parts.push(grade);
  }
  if (route.length != null) {
    parts.push(`${route.length} ${lengthUnitLabel(route.lengthUnit)}`);
  }
  return parts.join(" · ");
}

function lengthUnitLabel(unit: string | null): string {
  if (!unit || /^(mts|m|meter|meters|metric)$/i.test(unit)) return "m";
  return unit;
}

