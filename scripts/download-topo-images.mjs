import fs from "node:fs";
import path from "node:path";

const seed = JSON.parse(
  fs.readFileSync(
    path.join(import.meta.dirname, "seed/deportiva.json"),
    "utf8",
  ),
);

const outDir = path.join(
  process.env.HOME,
  "Downloads",
  "andescalada-topo-images",
);
fs.mkdirSync(outDir, { recursive: true });

const images = new Map();
for (const zone of seed.zones) {
  if (zone.coverImageUrl) images.set(zone.coverImageUrl, `${zone.slug}-cover.jpg`);
}
for (const topo of seed.topos) {
  if (topo.imageUrl) images.set(topo.imageUrl, `${topo.id}.jpg`);
}

for (const [url, filename] of images) {
  const dest = path.join(outDir, filename);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    console.log("skip", filename);
    continue;
  }
  const response = await fetch(url);
  if (!response.ok) {
    console.warn("fail", url, response.status);
    continue;
  }
  fs.writeFileSync(dest, Buffer.from(await response.arrayBuffer()));
  console.log("ok", filename);
}
console.log("images", images.size, outDir);
