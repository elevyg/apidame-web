import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { FeedPostData } from "@/components/estetica/feed/posts";

const contentDir = path.join(process.cwd(), "content", "notas");
const publicNotasDir = path.join(
  process.cwd(),
  "public",
  "notas-de-cordada",
);

const cardTone = z.union([
  z.literal("paper"),
  z.literal("canvas"),
  z.literal("beige"),
  z.literal("editorial-light"),
  z.literal("editorial-dark"),
]);

const cardSchema = z.intersection(
  z.object({
    id: z.string().min(1),
    share: z.string(),
  }),
  z.union([
    z.object({
      type: z.literal("title"),
      kicker: z.string(),
      text: z.string(),
      tone: cardTone,
      art: z.string().optional(),
      artAlt: z.string().optional(),
      object: z.string().optional(),
    }),
    z.object({
      type: z.literal("field"),
      kicker: z.string(),
      paras: z.array(z.string()),
      tone: cardTone,
      feature: z.string().optional(),
      meta: z.array(z.string()).optional(),
    }),
    z.object({
      type: z.literal("photo"),
      src: z.string(),
      alt: z.string(),
      caption: z.string(),
      object: z.string().optional(),
    }),
  ]),
);

export const feedPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string(),
  description: z.string(),
  og: z.object({
    title: z.string(),
    subtitle: z.string(),
    imageAlt: z.string(),
  }),
  cards: z.array(cardSchema).min(1),
});

function jsonPath(slug: string) {
  return path.join(contentDir, `${slug}.json`);
}

function poolDir(slug: string) {
  return path.join(publicNotasDir, slug, "pool");
}

export async function readNotaJson(slug: string): Promise<FeedPostData> {
  const raw = await fs.readFile(jsonPath(slug), "utf8");
  return feedPostSchema.parse(JSON.parse(raw)) as FeedPostData;
}

export async function writeNotaJson(post: FeedPostData) {
  const parsed = feedPostSchema.parse(post);
  const file = jsonPath(parsed.slug);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
  return parsed as FeedPostData;
}

export async function listNotaSlugs() {
  const entries = await fs.readdir(contentDir).catch(() => [] as string[]);
  return entries
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.replace(/\.json$/, ""));
}

export async function listPoolPhotos(slug: string) {
  const dir = poolDir(slug);
  const entries = await fs.readdir(dir).catch(() => [] as string[]);
  return entries
    .filter((name) => /\.(jpe?g|png|webp)$/i.test(name))
    .sort()
    .map((name) => `/notas-de-cordada/${slug}/pool/${name}`);
}
