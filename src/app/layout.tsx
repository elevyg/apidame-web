import type { Metadata } from "next";
import { Suspense } from "react";
import { foregen, brown, holluise } from "./fonts";
import GoogleAnalytics from "./GoogleAnalytics";
import {
  siteDescription,
  siteName,
  siteOgImage,
  siteTitle,
  siteUrl,
} from "./site";
import "./globals.css";

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: siteTitle,
    template: "%s | Apidame",
  },
  description: siteDescription,
  icons: { icon: "/favicon.ico" },
  keywords: [
    "Apidame",
    "escalada Chile Chico",
    "muro de escalada Chile Chico",
    "muro Chile Chico",
    "topos cerro apidame",
    "cerro colorado chile chico",
    "escalada deportiva Aysén",
    "patagonia chilena",
  ],
  openGraph: {
    siteName,
    locale: "es_CL",
    type: "website",
    images: [siteOgImage],
  },
  twitter: {
    card: "summary_large_image",
    images: [siteOgImage.url],
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
    <html lang="es-CL">
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
