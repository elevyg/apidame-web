import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { guidePdfs } from "@/db/schema";
import { getWallById, getZoneById, getZoneBySlug, listAllZones } from "./queries";
import { PDFDocument } from "pdf-lib";
import { buildZoneCoverPdf } from "./pdf";
import { minGuidebookPages } from "./pdfPlan";

export function coverPdfId(zoneId: string) {
  return `cover:${zoneId}`;
}

async function upsertPdf(input: {
  id: string;
  kind: "cover";
  zoneId: string;
  filename: string;
  bytes: Uint8Array;
  generatedAt: Date;
}) {
  await db.delete(guidePdfs).where(eq(guidePdfs.id, input.id));
  await db.insert(guidePdfs).values({
    id: input.id,
    kind: input.kind,
    zoneId: input.zoneId,
    wallId: null,
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
  return rows.reduce(
    (latest, row) => (row.generatedAt > latest ? row.generatedAt : latest),
    rows[0]!.generatedAt,
  );
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

export async function refreshPdfsForWall(wallId: string) {
  const context = await getWallById(wallId);
  if (context) await refreshZoneCover(context.zone.id);
}

export async function refreshPdfsForZone(zoneId: string) {
  await refreshZoneCover(zoneId);
}

export async function refreshAllGuidePdfs() {
  const crags = await listAllZones();
  for (const zone of crags) {
    await refreshPdfsForZone(zone.id);
  }
}

async function storedPageCount(bytes: Uint8Array) {
  try {
    return (await PDFDocument.load(bytes)).getPageCount();
  } catch {
    return 0;
  }
}

export async function loadZonePdfBytes(zoneSlug: string) {
  const guide = await getZoneBySlug(zoneSlug);
  if (!guide || !guide.zone.published) return null;
  let cover = await getStoredPdf(coverPdfId(guide.zone.id));
  const pages = cover ? await storedPageCount(new Uint8Array(cover.bytes)) : 0;
  if (!cover || pages < minGuidebookPages(guide)) {
    try {
      await refreshZoneCover(guide.zone.id);
      cover = await getStoredPdf(coverPdfId(guide.zone.id));
    } catch (error) {
      console.error("guide pdf refresh failed", zoneSlug, error);
    }
  }
  if (!cover) return null;
  return {
    bytes: new Uint8Array(cover.bytes),
    filename: cover.filename,
    generatedAt: cover.generatedAt,
  };
}
