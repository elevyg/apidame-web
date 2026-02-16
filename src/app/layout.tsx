import type { Metadata } from "next";
import { foregen, brown, holluise } from "./fonts";
import GoogleAnalytics from "./GoogleAnalytics";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  "https://apidameboulder.com";
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Apidame Boulder | Escalada en Chile Chico",
    template: "%s | Apidame Boulder",
  },
  description:
    "Gimnasio de escalada y boulder en Chile Chico, Aysén. Horarios, precios, ubicación y topos del Cerro Apidame.",
  icons: { icon: "/favicon.ico" },
  keywords: [
    "Apidame Boulder",
    "escalada Chile Chico",
    "boulder Aysén",
    "topos cerro apidame",
    "patagonia chilena",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Apidame Boulder | Escalada en Chile Chico",
    description:
      "Escala con nosotros en Chile Chico. Revisa horarios, precios y los topos del Cerro Apidame.",
    url: "/",
    siteName: "Apidame Boulder",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Apidame Boulder en Chile Chico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apidame Boulder | Escalada en Chile Chico",
    description:
      "Escala con nosotros en Chile Chico. Horarios, precios y topos del Cerro Apidame.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "sports",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${foregen.variable} ${brown.variable} ${holluise.variable} font-sans`}
      >
        {children}
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
