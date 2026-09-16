export const KIND_COLORS: Record<string, string> = {
  Sport: "#E11845",
  Trad: "#F2CA19",
  Boulder: "#E11845",
  Mixed: "#FF00BD",
  Ice: "#0057E9",
  Aid: "#8931EF",
};

export const SELECTED_COLOR = "#87E911";
export const DIMMED_COLOR = "rgba(28, 25, 22, 0.28)";

export function routeColor(kind: string): string {
  return KIND_COLORS[kind] ?? "#E11845";
}
