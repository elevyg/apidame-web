export type CreateKind = "sector" | "pared" | "ruta";

export type CreateStep = "kind" | "zone" | "sector" | "wall" | "ready";

export function nextCreateStep(input: {
  kind: CreateKind | null;
  zoneId?: string | null;
  sectorId?: string | null;
  wallId?: string | null;
}): CreateStep {
  if (!input.kind) return "kind";
  if (input.kind === "sector") return input.zoneId ? "ready" : "zone";
  if (input.kind === "pared") {
    if (input.sectorId) return "ready";
    return input.zoneId ? "sector" : "zone";
  }
  if (input.wallId) return "ready";
  if (input.sectorId) return "wall";
  return input.zoneId ? "sector" : "zone";
}
