import type { Metadata } from "next";
import Image from "next/image";
import TrackedLink from "@/components/TrackedLink";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { optimizedImageUrl } from "@/lib/climbing/cloudinary";
import { listPublishedZones } from "@/lib/guide/queries";
import { pageMetadata } from "../seo";

export const metadata: Metadata = pageMetadata({
  title: "Escalada deportiva en Chile Chico",
  description:
    "Topos de escalada deportiva en Chile Chico: Cerro el Indio, Pared Burgos y Cerro Azul. Ábrelos en el teléfono o baja el PDF.",
  path: "/deportiva",
});

export default async function DeportivaPage() {
  const crags = await listPublishedZones();

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader current="deportiva" />
      <article>
        <header className="page-shell border-rule border-b py-12 md:py-16">
          <p className="kicker">Chile Chico · Aysén</p>
          <h1 className="font-display mt-4 text-4xl md:text-6xl">
            Escalada deportiva
          </h1>
          <p className="measure font-brown text-ink-soft mt-6 text-base leading-relaxed md:text-lg">
            Tres zonas cerca del pueblo en Chile Chico: Cerro el Indio, Pared
            Burgos y Cerro Azul. Topos para abrir en el teléfono o bajar en
            PDF.
          </p>
        </header>
        <section className="page-shell divide-rule divide-y">
          {crags.map((zone) => {
            const cover = zone.coverImageUrl
              ? optimizedImageUrl(
                  {
                    url: zone.coverImageUrl,
                    publicId: zone.coverPublicId,
                  },
                  1400,
                )
              : null;
            return (
              <TrackedLink
                key={zone.id}
                href={`/deportiva/${zone.slug}`}
                event="deportiva_zone_opened"
                properties={{ zone: zone.slug }}
                className="group grid gap-6 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-center"
              >
                <div>
                  <p className="kicker">Guía</p>
                  <h2 className="font-display mt-2 text-3xl md:text-4xl">
                    {zone.name}
                  </h2>
                  {zone.description ? (
                    <p className="font-brown text-ink-soft mt-4 line-clamp-4 text-sm leading-relaxed md:text-base">
                      {zone.description}
                    </p>
                  ) : null}
                  <span className="font-brown mt-5 inline-block text-sm tracking-[0.14em] uppercase underline decoration-from-font underline-offset-4">
                    Abrir zona
                  </span>
                </div>
                {cover ? (
                  <Image
                    src={cover}
                    alt={zone.name}
                    width={zone.coverImageWidth ?? 1600}
                    height={zone.coverImageHeight ?? 1200}
                    unoptimized
                    className="border-rule h-56 w-full border object-cover md:h-72"
                  />
                ) : null}
              </TrackedLink>
            );
          })}
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
