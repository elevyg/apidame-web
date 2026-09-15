import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { ogSize } from "./ogFont";

export async function loadOgCover(src: string) {
  const relative = src.replace(/^\//, "");
  const file = await readFile(join(process.cwd(), "public", relative));
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
