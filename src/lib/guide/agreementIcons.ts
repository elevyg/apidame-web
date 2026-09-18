import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ICONS_DIR = join(process.cwd(), "src/assets/andescalada-icons");

export function agreementIconFile(icon: string | null | undefined) {
  if (!icon) return null;
  const color = join(ICONS_DIR, `${icon}-color.svg`);
  if (existsSync(color)) return color;
  const plain = join(ICONS_DIR, `${icon}.svg`);
  if (existsSync(plain)) return plain;
  return null;
}

export async function rasterizeAgreementIcon(
  icon: string | null | undefined,
  size = 72,
) {
  const file = agreementIconFile(icon);
  if (!file) return null;
  const svg = await readFile(file);
  return new Uint8Array(await sharp(svg).resize(size, size).png().toBuffer());
}
