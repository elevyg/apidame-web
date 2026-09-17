import type { Metadata } from "next";
import { siteName, siteOgImage } from "./site";

export function flattenDescription(
  text: string | null | undefined,
  fallback: string,
  max = 160,
): string {
  const flat = (text ?? "").replace(/\s+/g, " ").trim();
  const source = flat || fallback;
  if (source.length <= max) return source;
  const cut = source.slice(0, max - 1);
  const at = cut.lastIndexOf(" ");
  return `${cut.slice(0, at > max * 0.6 ? at : max - 1)}…`;
}

export function pageMetadata({
  title,
  description,
  path,
  shareTitle,
}: {
  title: string;
  description: string;
  path: string;
  shareTitle?: string;
}): Metadata {
  const ogTitle = shareTitle ?? `${title} | ${siteName}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName,
      locale: "es_CL",
      type: "website",
      images: [siteOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [siteOgImage.url],
    },
  };
}
