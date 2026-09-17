import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { guidePdfs } from "@/db/schema";
import {
  getWallById,
  getWallGuide,
  getZoneById,
  getZoneBySlug,
  listAllZones,
} from "./queries";
import {
  buildWallPdf,
  buildZoneCoverPdf,
  mergePdfBuffers,
} from "./pdf";

export function coverPdfId(zoneId: string) {
  return `cover:${zoneId}`;
}

export function wallPdfId(wallId: string) {
  return `wall:${wallId}`;
}

async function upsertPdf(input: {
  id: string;
  kind: "cover" | "wall";
  zoneId: string;
  wallId?: string | null;
  filename: string;
  bytes: Uint8Array;
  generatedAt: Date;
}) {
  await db.delete(guidePdfs).where(eq(guidePdfs.id, input.id));
  await db.insert(guidePdfs).values({
    id: input.id,
    kind: input.kind,
    zoneId: input.zoneId,
    wallId: input.wallId ?? null,
    filename: input.filename,
    bytes: Buffer.from(input.bytes),
    generatedAt: input.generatedAt,
  });
}

export async function getStoredPdf(id: string) {
  return db
    .select()
    .from(guidePdfs)
    .where(eq(guidePdfs.id, id))
    .then((rows) => rows[0] ?? null);
}

export async function latestPdfDate(zoneId: string): Promise<Date | null> {
  const rows = await db
    .select({ generatedAt: guidePdfs.generatedAt })
    .from(guidePdfs)
    .where(eq(guidePdfs.zoneId, zoneId));
  if (rows.length === 0) return null;
  return rows.reduce((latest, row) =>
    row.generatedAt > latest ? row.generatedAt : latest,
  rows[0]!.generatedAt);
}

export async function refreshZoneCover(zoneId: string, generatedAt = new Date()) {
  const guide = await getZoneById(zoneId);
  if (!guide) return;
  const bytes = await buildZoneCoverPdf(guide, generatedAt);
  await upsertPdf({
    id: coverPdfId(zoneId),
    kind: "cover",
    zoneId,
    filename: `${guide.zone.slug}.pdf`,
    bytes,
    generatedAt,
  });
}

export async function refreshWallPdf(wallId: string, generatedAt = new Date()) {
  const context = await getWallById(wallId);
  if (!context) return;
  const guide = await getWallGuide(
    context.zone.slug,
    context.sector.slug,
    context.wall.slug,
  );
  if (!guide) return;
  const bytes = await buildWallPdf(guide, generatedAt);
  await upsertPdf({
    id: wallPdfId(wallId),
    kind: "wall",
    zoneId: context.zone.id,
    wallId,
    filename: `${context.zone.slug}-${context.wall.slug}.pdf`,
    bytes,
    generatedAt,
  });
}

export async function refreshPdfsForWall(wallId: string) {
  const now = new Date();
  await refreshWallPdf(wallId, now);
  const context = await getWallById(wallId);
  if (context) await refreshZoneCover(context.zone.id, now);
}

export async function refreshPdfsForZone(zoneId: string) {
  const now = new Date();
  const guide = await getZoneById(zoneId);
  if (!guide) return;
  await refreshZoneCover(zoneId, now);
  for (const wall of guide.walls) {
    await refreshWallPdf(wall.id, now);
  }
}

export async function refreshAllGuidePdfs() {
  const crags = await listAllZones();
  for (const zone of crags) {
    await refreshPdfsForZone(zone.id);
  }
}

export async function loadZonePdfBytes(zoneSlug: string) {
  const guide = await getZoneBySlug(zoneSlug);
  if (!guide || !guide.zone.published) return null;
  let cover = await getStoredPdf(coverPdfId(guide.zone.id));
  if (!cover) {
    await refreshZoneCover(guide.zone.id);
    cover = await getStoredPdf(coverPdfId(guide.zone.id));
  }
  const wallBuffers: Uint8Array[] = [];
  for (const wall of guide.walls) {
    let stored = await getStoredPdf(wallPdfId(wall.id));
    if (!stored) {
      await refreshWallPdf(wall.id);
      stored = await getStoredPdf(wallPdfId(wall.id));
    }
    if (stored) wallBuffers.push(new Uint8Array(stored.bytes));
  }
  const parts = [
    ...(cover ? [new Uint8Array(cover.bytes)] : []),
    ...wallBuffers,
  ];
  if (parts.length === 0) return null;
  const bytes = await mergePdfBuffers(parts);
  const generatedAt =
    (await latestPdfDate(guide.zone.id)) ?? cover?.generatedAt ?? new Date();
  return {
    bytes,
    filename: `${guide.zone.slug}.pdf`,
    generatedAt,
  };
}

export async function loadWallPdfBytes(
  zoneSlug: string,
  sectorSlug: string,
  wallSlug: string,
) {
  const guide = await getWallGuide(zoneSlug, sectorSlug, wallSlug);
  if (!guide || !guide.zone.published) return null;
  let stored = await getStoredPdf(wallPdfId(guide.wall.id));
  if (!stored) {
    await refreshWallPdf(guide.wall.id);
    stored = await getStoredPdf(wallPdfId(guide.wall.id));
  }
  if (!stored) return null;
  return {
    bytes: new Uint8Array(stored.bytes),
    filename: stored.filename,
    generatedAt: stored.generatedAt,
  };
}
