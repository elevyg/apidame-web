import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogSize = {
  width: 1200,
  height: 630,
} as const;

const fontsDir = join(process.cwd(), "src/assets/fonts");

async function loadFont(file: string) {
  return readFile(join(fontsDir, file));
}

export async function ogImageOptions() {
  const [brown, foregen, holluise] = await Promise.all([
    loadFont("BrownStd-Regular.otf"),
    loadFont("The-Foregen-Regular.ttf"),
    loadFont("Holluise-Regular.ttf"),
  ]);

  return {
    ...ogSize,
    fonts: [
      {
        name: "Brown",
        data: brown,
        weight: 400 as const,
        style: "normal" as const,
      },
      {
        name: "Brown",
        data: brown,
        weight: 400 as const,
        style: "italic" as const,
      },
      {
        name: "Foregen",
        data: foregen,
        weight: 400 as const,
        style: "normal" as const,
      },
      {
        name: "Holluise",
        data: holluise,
        weight: 400 as const,
        style: "normal" as const,
      },
    ],
  };
}
