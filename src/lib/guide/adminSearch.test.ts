import { describe, expect, it } from "vitest";
import { searchAdminCatalog, type AdminSearchItem } from "./adminSearch";

const items: AdminSearchItem[] = [
  {
    kind: "zona",
    id: "z1",
    name: "Cerro Azul",
    href: "/dashboard/zonas/z1",
    crumb: "Zona",
  },
  {
    kind: "sector",
    id: "s1",
    name: "Placa Central",
    href: "/dashboard/zonas/z1#s1",
    crumb: "Cerro Azul",
  },
  {
    kind: "pared",
    id: "w1",
    name: "Muro Sur",
    href: "/dashboard/paredes/w1",
    crumb: "Cerro Azul · Placa Central",
  },
  {
    kind: "ruta",
    id: "r1",
    name: "La Placa",
    href: "/dashboard/rutas/r1",
    crumb: "Cerro Azul · Muro Sur",
  },
];

describe("searchAdminCatalog", () => {
  it("returns nothing until there is a query", () => {
    expect(searchAdminCatalog(items, "  ")).toEqual({
      hits: [],
      canCreate: false,
    });
  });

  it("finds routes, walls, sectors and zones by name", () => {
    expect(searchAdminCatalog(items, "placa").hits.map((hit) => hit.id)).toEqual(
      ["s1", "r1", "w1"],
    );
    expect(searchAdminCatalog(items, "azul").hits[0]?.kind).toBe("zona");
  });

  it("ignores accents and ranks an exact name first", () => {
    const hits = searchAdminCatalog(items, "la placa").hits;
    expect(hits[0]?.id).toBe("r1");
  });

  it("offers create when the exact name does not exist", () => {
    const miss = searchAdminCatalog(items, "Diedro Sur");
    expect(miss.hits).toEqual([]);
    expect(miss.canCreate).toBe(true);
  });

  it("does not offer create when the name already exists", () => {
    expect(searchAdminCatalog(items, "La Placa").canCreate).toBe(false);
  });
});
