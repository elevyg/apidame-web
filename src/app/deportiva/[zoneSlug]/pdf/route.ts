import { notFound } from "next/navigation";
import { loadZonePdfBytes } from "@/lib/guide/store";

type PdfProps = {
  params: Promise<{ zoneSlug: string }>;
};

export async function GET(_request: Request, { params }: PdfProps) {
  const { zoneSlug } = await params;
  const stored = await loadZonePdfBytes(zoneSlug);
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
