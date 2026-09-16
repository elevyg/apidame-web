import { requireZoneBySlug } from "@/lib/guide/queries";
import { buildZonePdf } from "@/lib/guide/pdf";

type PdfProps = {
  params: Promise<{ zoneSlug: string }>;
};

export async function GET(_request: Request, { params }: PdfProps) {
  const { zoneSlug } = await params;
  const guide = await requireZoneBySlug(zoneSlug);
  const bytes = await buildZonePdf(guide);
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${zoneSlug}.pdf"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
