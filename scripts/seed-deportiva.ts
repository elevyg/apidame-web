import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { replaceGuideSeed } from "../src/db/seed";
import type { GuideSeed } from "../src/lib/climbing/fromExtract";

const seed = JSON.parse(
  readFileSync(resolve("scripts/seed/deportiva.json"), "utf8"),
) as GuideSeed;

async function main() {
  await replaceGuideSeed(seed);
  console.log(
    `seed ok: ${seed.zones.length} zonas, ${seed.routes.length} rutas, ${seed.paths.length} líneas`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
