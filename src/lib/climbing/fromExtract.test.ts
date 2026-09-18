import { describe, expect, it } from "vitest";
import {
  applyLocations,
  seedFromExtract,
  type ExtractDump,
} from "./fromExtract";

const dump: ExtractDump = {
  texts: [{ id: "t1", originalText: "Zona viva" }],
  images: [
    {
      id: "img1",
      url: "https://res.cloudinary.com/x/topo.jpg",
      width: 100,
      height: 200,
      publicId: "andescalada-app/topo",
    },
  ],
  grades: [{ routeId: "r1", originalGrade: "6a", originalGradeSystem: "French" }],
  lengths: [],
  zones: [
    {
      id: "z1",
      slug: "cerro-azul",
      name: "Cerro Azul",
      descriptionId: "t1",
      currentStatus: "Published",
      isDeleted: "NotDeleted",
      coverPhotoId: "img1",
    },
  ],
  sectors: [
    {
      id: "s-live",
      zoneId: "z1",
      slug: "sala",
      name: "Sala",
      position: 1,
      sectorKind: "Wall",
      isDeleted: "NotDeleted",
    },
    {
      id: "s-test",
      zoneId: "z1",
      slug: "test",
      name: "Test",
      position: 99,
      sectorKind: "Wall",
      isDeleted: "NotDeleted",
    },
    {
      id: "s-gone",
      zoneId: "z1",
      slug: "old",
      name: "Old",
      position: 2,
      sectorKind: "Wall",
      isDeleted: "DeletedPublic",
    },
  ],
  walls: [
    {
      id: "w1",
      sectorId: "s-live",
      slug: "principal",
      name: "Principal",
      position: 0,
      isDeleted: "NotDeleted",
    },
    {
      id: "w-test",
      sectorId: "s-test",
      slug: "principal",
      name: "Basura",
      position: 0,
      isDeleted: "NotDeleted",
    },
  ],
  topos: [
    {
      id: "topo1",
      wallId: "w1",
      slug: "principal-topo",
      name: "Principal topo",
      position: 0,
      main: 1,
      routeStrokeWidth: "1.00",
      imageId: "img1",
      isDeleted: "NotDeleted",
    },
  ],
  routes: [
    {
      id: "r1",
      wallId: "w1",
      slug: "pitufina",
      name: "Pitufina",
      position: 1,
      kind: "Sport",
      unknownName: 0,
      isDeleted: "NotDeleted",
    },
    {
      id: "r-dead",
      wallId: "w1",
      slug: "borrada",
      name: "Borrada",
      position: 2,
      kind: "Sport",
      unknownName: 0,
      isDeleted: "DeletedPublic",
    },
  ],
  paths: [
    {
      id: "p1",
      topoId: "topo1",
      routeId: "r1",
      path: "1,2 3,4",
      hideStart: 0,
      isDeleted: "NotDeleted",
    },
  ],
};

describe("seedFromExtract", () => {
  it("keeps published live content and drops test plus deleted rows", () => {
    const seed = seedFromExtract(dump);
    expect(seed.zones).toHaveLength(1);
    expect(seed.zones[0]?.description).toBe("Zona viva");
    expect(seed.sectors.map((s) => s.slug)).toEqual(["sala"]);
    expect(seed.walls).toHaveLength(1);
    expect(seed.routes.map((r) => r.name)).toEqual(["Pitufina"]);
    expect(seed.routes[0]?.grade).toBe("6a");
    expect(seed.routes[0]?.gradeSystem).toBe("French");
    expect(seed.topos[0]?.imagePublicId).toBe("andescalada-app/topo");
    expect(seed.paths).toHaveLength(1);
    expect(seed.zones[0]?.latitude).toBeNull();
    expect(seed.agreements).toEqual([]);
    expect(seed.routes[0]?.starCount).toBe(0);
  });

  it("averages live route evaluations", () => {
    const seed = seedFromExtract({
      ...dump,
      evaluations: [
        { routeId: "r1", evaluation: 5, isDeleted: "NotDeleted" },
        { routeId: "r1", evaluation: 3, isDeleted: "NotDeleted" },
        { routeId: "r1", evaluation: 1, isDeleted: "DeletedPublic" },
      ],
    });
    expect(seed.routes[0]?.starAverage).toBe(4);
    expect(seed.routes[0]?.starCount).toBe(2);
  });

  it("keeps zone agreements except NotAplicable", () => {
    const seed = seedFromExtract({
      ...dump,
      agreements: [
        {
          id: "a1",
          title: "No fuego",
          description: "Sin fogatas",
          classic: "NoFire",
          icon: null,
          isDeleted: "NotDeleted",
        },
      ],
      zoneAgreements: [
        {
          id: "za1",
          zoneId: "z1",
          agreementId: "a1",
          level: "Critical",
          position: 0,
          isDeleted: "NotDeleted",
        },
        {
          id: "za2",
          zoneId: "z1",
          agreementId: "a1",
          level: "NotAplicable",
          position: 1,
          isDeleted: "NotDeleted",
        },
      ],
    });
    expect(seed.agreements).toHaveLength(1);
    expect(seed.zoneAgreements).toEqual([
      {
        id: "za1",
        zoneId: "z1",
        agreementId: "a1",
        level: "Critical",
        position: 0,
        comment: null,
      },
    ]);
  });

  it("stores Yosemite grades as French", () => {
    const seed = seedFromExtract({
      ...dump,
      grades: [
        {
          routeId: "r1",
          originalGrade: "5.10c",
          originalGradeSystem: "Yosemite",
        },
      ],
    });
    expect(seed.routes[0]?.grade).toBe("6b");
    expect(seed.routes[0]?.gradeSystem).toBe("French");
  });

  it("copies lat/lng from the location seed by id", () => {
    const seed = applyLocations(seedFromExtract(dump), {
      zones: { z1: { latitude: -46.5, longitude: -71.7 } },
      sectors: { "s-live": { latitude: -46.51, longitude: -71.71 } },
    });
    expect(seed.zones[0]?.latitude).toBe(-46.5);
    expect(seed.sectors[0]?.longitude).toBe(-71.71);
  });
});
