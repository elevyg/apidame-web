import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { replaceGuideSeed } from "../src/db/seed";
import { refreshAllGuidePdfs } from "../src/lib/guide/store";
import {
  applyLocations,
  type GuideSeed,
  type LocationSeed,
} from "../src/lib/climbing/fromExtract";

const seed = applyLocations(
  JSON.parse(
    readFileSync(resolve("scripts/seed/deportiva.json"), "utf8"),
  ) as GuideSeed,
  JSON.parse(
    readFileSync(resolve("scripts/seed/locations.json"), "utf8"),
  ) as LocationSeed,
);

async function main() {
  await replaceGuideSeed(seed);
  console.log(
    `seed ok: ${seed.zones.length} zonas, ${seed.routes.length} rutas, ${seed.paths.length} líneas`,
  );
  await refreshAllGuidePdfs();
  console.log("pdfs ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
