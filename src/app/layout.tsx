import type { Metadata } from "next";
import { Suspense } from "react";
import { foregen, brown, holluise } from "./fonts";
import GoogleAnalytics from "./GoogleAnalytics";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  "https://apidameboulder.com";
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Apidame | Chile Chico",
    template: "%s | Apidame",
  },
  description:
    "Muro, topos del Cerro Apidame y escalada deportiva en Chile Chico, Aysén.",
  icons: { icon: "/favicon.ico" },
  keywords: [
    "Apidame",
    "escalada Chile Chico",
    "muro Chile Chico",
    "topos cerro apidame",
    "escalada deportiva Aysén",
    "patagonia chilena",
  ],
  openGraph: {
    title: "Apidame | Chile Chico",
    description:
      "Muro, topos del Cerro Apidame y escalada deportiva en Chile Chico.",
    url: "/",
    siteName: "Apidame",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Apidame en Chile Chico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apidame | Chile Chico",
    description:
      "Muro, topos del Cerro Apidame y escalada deportiva en Chile Chico.",
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
        className={`${foregen.variable} ${brown.variable} ${holluise.variable} bg-paper text-ink antialiased`}
      >
        {children}
        {gaId ? (
          <Suspense fallback={null}>
            <GoogleAnalytics gaId={gaId} />
          </Suspense>
        ) : null}
      </body>
    </html>
  );
}
