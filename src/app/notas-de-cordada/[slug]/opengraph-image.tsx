import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import NotesOgImage from "@/components/estetica/feed/NotesOgImage";
import { loadOgCover } from "@/components/estetica/feed/ogCover";
import { ogImageOptions } from "@/components/estetica/feed/ogFont";
import { getFeedPost, getPostCover } from "@/components/estetica/feed/posts";

export const runtime = "nodejs";
export const alt = "Notas de cordada de Apidame";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getFeedPost(slug);
  if (!post) notFound();

  const cover = getPostCover(post);
  const imageSrc = cover ? await loadOgCover(cover.src) : undefined;

  return new ImageResponse(
    <NotesOgImage
      eyebrow="Notas de cordada"
      title={post.og.title}
      subtitle={post.og.subtitle}
      imageSrc={imageSrc}
    />,
    await ogImageOptions(),
  );
}
