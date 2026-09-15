import { ImageResponse } from "next/og";
import NotesOgImage from "@/components/estetica/feed/NotesOgImage";
import { ogImageOptions } from "@/components/estetica/feed/ogFont";

export const runtime = "nodejs";
export const alt = "Notas de cordada de Apidame";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    <NotesOgImage
      eyebrow="Notas de cordada"
      title="Notas de cordada"
      subtitle="Escalada tradicional, equipo y decisiones de cordada desde Chile Chico"
    />,
    await ogImageOptions(),
  );
}
