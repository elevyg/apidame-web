import { notFound } from "next/navigation";
import { loadWallPdfBytes } from "@/lib/guide/store";

type PdfProps = {
  params: Promise<{
    zoneSlug: string;
    sectorSlug: string;
    wallSlug: string;
  }>;
};

export async function GET(_request: Request, { params }: PdfProps) {
  const { zoneSlug, sectorSlug, wallSlug } = await params;
  const stored = await loadWallPdfBytes(zoneSlug, sectorSlug, wallSlug);
  if (!stored) notFound();
  return new Response(Buffer.from(stored.bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${stored.filename}"`,
      "Cache-Control": "no-store",
      "Last-Modified": stored.generatedAt.toUTCString(),
    },
  });
}
