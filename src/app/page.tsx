import type { Metadata } from "next";
import GymAccess from "@/components/GymAccess";
import HomePanel from "@/components/estetica/HomePanel";
import ProjectField from "@/components/estetica/ProjectField";
import SiteFooter from "@/components/SiteFooter";
import {
  siteDescription,
  siteName,
  siteOgImage,
  siteTitle,
  siteUrl,
} from "./site";

export const metadata: Metadata = {
  title: { absolute: siteTitle },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName,
    locale: "es_CL",
    type: "website",
    images: [siteOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [siteOgImage.url],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: siteName,
  alternateName: "Apidame Boulder",
  image: `${siteUrl}${siteOgImage.url}`,
  description: siteDescription,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chile Chico",
    addressRegion: "Aysén",
    addressCountry: "CL",
  },
  url: siteUrl,
  sameAs: ["https://www.instagram.com/apidameboulder/"],
  inLanguage: "es-CL",
};

export default function Home() {
  return (
    <main>
      <ProjectField />
      <HomePanel id="gimnasio" className="bg-paper">
        <GymAccess />
      </HomePanel>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
