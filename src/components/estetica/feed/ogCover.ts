import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { ogSize } from "./ogFont";

function assetBase() {
  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    (vercel ? `https://${vercel}` : "http://localhost:4000")
  );
}

async function readPublicAsset(src: string) {
  const relative = src.replace(/^\//, "");
  try {
    return await readFile(join(process.cwd(), "public", relative));
  } catch {
    const res = await fetch(new URL(`/${relative}`, assetBase()));
    if (!res.ok) {
      throw new Error(`No se pudo leer la portada OG (${src})`);
    }
    return Buffer.from(await res.arrayBuffer());
  }
}

export async function loadOgCover(src: string) {
  const file = await readPublicAsset(src);
  const resized = await sharp(file)
    .rotate()
    .resize(Math.round(ogSize.width * 0.52), ogSize.height, {
      fit: "cover",
      position: "attention",
    })
    .jpeg({ quality: 80 })
    .toBuffer();
  return `data:image/jpeg;base64,${resized.toString("base64")}`;
}
