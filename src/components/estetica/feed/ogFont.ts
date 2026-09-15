import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogSize = {
  width: 1200,
  height: 630,
} as const;

export async function ogImageOptions() {
  const data = await readFile(
    join(process.cwd(), "src/assets/fonts/BrownStd-Regular.otf"),
  );
  return {
    ...ogSize,
    fonts: [
      {
        name: "Brown",
        data,
        weight: 400 as const,
        style: "normal" as const,
      },
      {
        name: "Brown",
        data,
        weight: 400 as const,
        style: "italic" as const,
      },
    ],
  };
}
