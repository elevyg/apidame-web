import type { Metadata } from "next";
import MuroAccess from "@/components/MuroAccess";
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
import { pageMetadata } from "./seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: siteTitle,
    description: siteDescription,
    path: "/",
    shareTitle: siteTitle,
  }),
  title: { absolute: siteTitle },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: siteName,
  alternateName: ["Apidame Boulder", "Muro de escalada"],
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
      <HomePanel id="muro-de-escalada" className="bg-paper">
        <MuroAccess />
      </HomePanel>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
