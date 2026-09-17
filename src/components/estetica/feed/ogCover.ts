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

function assertSafeRelative(rest: string, src: string) {
  const parts = rest.split("/").filter(Boolean);
  if (
    parts.length === 0 ||
    parts.some((part) => part === "." || part === ".." || part.includes("\\"))
  ) {
    throw new Error(`Portada OG inválida (${src})`);
  }
  return parts;
}

export function publicOgAssetPath(src: string, cwd = process.cwd()) {
  const relative = src.replace(/^\//, "");
  if (relative.startsWith("estetica/feed/")) {
    const parts = assertSafeRelative(relative.slice("estetica/feed/".length), src);
    return join(cwd, "public", "estetica", "feed", ...parts);
  }
  if (relative.startsWith("notas-de-cordada/")) {
    const parts = assertSafeRelative(
      relative.slice("notas-de-cordada/".length),
      src,
    );
    return join(cwd, "public", "notas-de-cordada", ...parts);
  }
  throw new Error(`Portada OG fuera de los directorios permitidos (${src})`);
}

async function readPublicAsset(src: string) {
  const filePath = publicOgAssetPath(src);
  try {
    return await readFile(/* turbopackIgnore: true */ filePath);
  } catch {
    const relative = src.replace(/^\//, "");
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
