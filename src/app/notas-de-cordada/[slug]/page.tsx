import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FeedPost from "@/components/estetica/feed/FeedPost";
import { getFeedPost, posts } from "@/components/estetica/feed/posts";
import SiteHeader from "@/components/SiteHeader";

type NoteParams = {
  slug: string;
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<NoteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getFeedPost(slug);
  if (!post) {
    return { title: "Nota no encontrada", robots: { index: false } };
  }

  const canonical = `/notas-de-cordada/${post.slug}`;
  const ogImage = `${canonical}/opengraph-image`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      title: post.og.title,
      description: post.description,
      url: canonical,
      siteName: "Apidame",
      locale: "es_CL",
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.og.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.og.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function NotaDeCordadaPage({
  params,
}: {
  params: Promise<NoteParams>;
}) {
  const { slug } = await params;
  const post = getFeedPost(slug);
  if (!post) notFound();

  return (
    <div className="bg-canvas flex h-dvh flex-col overflow-hidden">
      <SiteHeader current="notas-de-cordada" pinned />
      <div className="min-h-0 flex-1">
        <FeedPost post={post} closeHref="/notas-de-cordada" />
      </div>
    </div>
  );
}
