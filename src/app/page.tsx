import type { Metadata } from "next";
import GymAccess from "@/components/GymAccess";
import ProjectField from "@/components/estetica/ProjectField";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "Apidame",
  alternateName: "Apidame Boulder",
  image: "https://apidameboulder.com/opengraph-image",
  description:
    "Muro, topos del Cerro Apidame y escalada deportiva en Chile Chico, Aysén.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chile Chico",
    addressRegion: "Aysén",
    addressCountry: "CL",
  },
  url: "https://apidameboulder.com",
  sameAs: ["https://www.instagram.com/apidameboulder/"],
};

export default function Home() {
  return (
    <main className="flex flex-col">
      <ProjectField />
      <GymAccess />
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
