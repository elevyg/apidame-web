import { eq } from "drizzle-orm";
import { db } from "./client";
import {
  routePaths,
  routes,
  sectors,
  topos,
  users,
  walls,
  zones,
  guidePdfs,
} from "./schema";
import type { GuideSeed } from "../lib/climbing/fromExtract";

export async function replaceGuideSeed(seed: GuideSeed) {
  await db.delete(routePaths);
  await db.delete(guidePdfs);
  await db.delete(routes);
  await db.delete(topos);
  await db.delete(walls);
  await db.delete(sectors);
  await db.delete(zones);

  if (seed.zones.length > 0) {
    await db.insert(zones).values(
      seed.zones.map((zone) => ({
        ...zone,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    );
  }
  if (seed.sectors.length > 0) await db.insert(sectors).values(seed.sectors);
  if (seed.walls.length > 0) await db.insert(walls).values(seed.walls);
  if (seed.topos.length > 0) await db.insert(topos).values(seed.topos);
  if (seed.routes.length > 0) await db.insert(routes).values(seed.routes);
  if (seed.paths.length > 0) await db.insert(routePaths).values(seed.paths);
}

export async function upsertUser(input: {
  email: string;
  name?: string | null;
  image?: string | null;
  role: "admin" | "user";
}) {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .then((rows) => rows[0] ?? null);

  if (existing) {
    await db
      .update(users)
      .set({
        name: input.name ?? existing.name,
        image: input.image ?? existing.image,
        role: input.role,
      })
      .where(eq(users.email, input.email));
    return existing.id;
  }

  const id = crypto.randomUUID();
  await db.insert(users).values({
    id,
    email: input.email,
    name: input.name ?? null,
    image: input.image ?? null,
    role: input.role,
  });
  return id;
}
