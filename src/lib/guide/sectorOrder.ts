export type OrderableSector = {
  id: string;
  position: number;
  latitude: number | null;
  longitude: number | null;
};

export function sortSectors<T extends { position: number; name?: string }>(
  sectors: T[],
): T[] {
  return [...sectors].sort((a, b) => {
    if (a.position !== b.position) return a.position - b.position;
    return (a.name ?? "").localeCompare(b.name ?? "");
  });
}

export function moveSectorId(
  ids: string[],
  id: string,
  direction: "up" | "down",
): string[] {
  const index = ids.indexOf(id);
  if (index < 0) return ids;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= ids.length) return ids;
  const next = [...ids];
  const current = next[index];
  const neighbor = next[swapWith];
  if (current == null || neighbor == null) return ids;
  next[index] = neighbor;
  next[swapWith] = current;
  return next;
}

export function rankNorthToSouth(sectors: OrderableSector[]): string[] {
  return [...sectors]
    .sort((a, b) => {
      if (a.latitude == null && b.latitude == null) {
        return a.position - b.position;
      }
      if (a.latitude == null) return 1;
      if (b.latitude == null) return -1;
      if (a.latitude !== b.latitude) return b.latitude - a.latitude;
      const aLng = a.longitude ?? 0;
      const bLng = b.longitude ?? 0;
      return aLng - bLng;
    })
    .map((sector) => sector.id);
}
