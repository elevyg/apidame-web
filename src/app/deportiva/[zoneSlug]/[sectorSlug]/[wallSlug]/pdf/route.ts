import { requireWallGuide } from "@/lib/guide/queries";
import { buildWallPdf } from "@/lib/guide/pdf";

type PdfProps = {
  params: Promise<{
    zoneSlug: string;
    sectorSlug: string;
    wallSlug: string;
  }>;
};

export async function GET(_request: Request, { params }: PdfProps) {
  const { zoneSlug, sectorSlug, wallSlug } = await params;
  const guide = await requireWallGuide(zoneSlug, sectorSlug, wallSlug);
  const bytes = await buildWallPdf(guide);
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${zoneSlug}-${wallSlug}.pdf"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
