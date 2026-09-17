import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { publicOgAssetPath } from "./ogCover";

describe("publicOgAssetPath", () => {
  it("resuelve covers del feed y de notas-de-cordada", () => {
    expect(
      publicOgAssetPath("/estetica/feed/simple-naranja.jpg", "/app"),
    ).toBe(join("/app", "public", "estetica", "feed", "simple-naranja.jpg"));
    expect(
      publicOgAssetPath(
        "/notas-de-cordada/estrategia-de-cintas/pool/foto-10.jpg",
        "/app",
      ),
    ).toBe(
      join(
        "/app",
        "public",
        "notas-de-cordada",
        "estrategia-de-cintas",
        "pool",
        "foto-10.jpg",
      ),
    );
  });

  it("rechaza paths fuera de los directorios permitidos", () => {
    expect(() => publicOgAssetPath("/tiles/cerro/0/0.jpg")).toThrow(
      /fuera de los directorios permitidos/,
    );
    expect(() =>
      publicOgAssetPath("/estetica/feed/../tiles/cerro/0/0.jpg"),
    ).toThrow(/inválida/);
    expect(() => publicOgAssetPath("/estetica/muro/sala-vacia.jpg")).toThrow(
      /fuera de los directorios permitidos/,
    );
  });
});
