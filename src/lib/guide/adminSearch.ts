export type AdminKind = "zona" | "sector" | "pared" | "ruta";

export type AdminSearchItem = {
  kind: AdminKind;
  id: string;
  name: string;
  href: string;
  crumb: string;
  zoneId?: string;
  sectorId?: string;
  wallId?: string;
};

export function foldAdminText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchAdminCatalog(items: AdminSearchItem[], query: string) {
  const needle = foldAdminText(query);
  if (!needle) return { hits: [] as AdminSearchItem[], canCreate: false };

  const scored = items
    .map((item) => {
      const name = foldAdminText(item.name);
      const crumb = foldAdminText(item.crumb);
      let score = 0;
      if (name === needle) score = 300;
      else if (name.startsWith(needle)) score = 200;
      else if (name.includes(needle)) score = 100;
      else if (crumb.includes(needle)) score = 40;
      else return null;
      return { item, score };
    })
    .filter((row): row is { item: AdminSearchItem; score: number } => row !== null)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));

  const hits = scored.map((row) => row.item);
  return {
    hits,
    canCreate: needle.length >= 2 && hits.length === 0,
  };
}
