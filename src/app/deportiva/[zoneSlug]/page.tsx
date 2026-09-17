import type { Metadata } from "next";
import DownloadPdfLink from "@/components/DownloadPdfLink";
import TrackedLink from "@/components/TrackedLink";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ZoneMap from "@/components/climbing/ZoneMap";
import { requireZoneBySlug } from "@/lib/guide/queries";
import { formatGuideDate } from "@/lib/guide/layout";
import { latestPdfDate } from "@/lib/guide/store";
import { buildZoneMapView, WEB_MAP_SIZE } from "@/lib/guide/mapView";
import { mapboxToken } from "@/lib/guide/mapbox";
import { zoneToMapInput } from "@/lib/guide/zoneMap";

type ZonePageProps = {
  params: Promise<{ zoneSlug: string }>;
};

export async function generateMetadata({
  params,
}: ZonePageProps): Promise<Metadata> {
  const { zoneSlug } = await params;
  const data = await requireZoneBySlug(zoneSlug);
  return {
    title: data.zone.name,
    description:
      data.zone.description?.slice(0, 160) ??
      `Topo de ${data.zone.name} en Chile Chico.`,
  };
}

export default async function ZonePage({ params }: ZonePageProps) {
  const { zoneSlug } = await params;
  const guide = await requireZoneBySlug(zoneSlug);
  const { zone, sectors, walls, routes } = guide;
  const generatedAt = await latestPdfDate(zone.id);
  const mapView =
    mapboxToken().length > 0
      ? buildZoneMapView(zoneToMapInput(guide), WEB_MAP_SIZE)
      : null;

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader current="deportiva" />
      <article>
        <header className="page-shell border-rule border-b py-12 md:py-16">
          <p className="kicker">Deportiva · Chile Chico</p>
          <h1 className="font-display mt-4 text-4xl md:text-6xl">{zone.name}</h1>
          {zone.description
            ? zone.description.split(/\n\n+/).map((paragraph) => (
                <p
                  key={paragraph}
                  className="measure font-brown text-ink-soft mt-5 text-base leading-relaxed md:text-lg"
                >
                  {paragraph}
                </p>
              ))
            : null}
          <DownloadPdfLink
            href={`/deportiva/${zone.slug}/pdf?t=${generatedAt?.getTime() ?? Date.now()}`}
            event="deportiva_zone_pdf"
            properties={{ zone: zone.slug }}
            className="font-brown mt-8 inline-block text-sm tracking-[0.14em] uppercase underline decoration-from-font underline-offset-4"
          >
            Descargar PDF
          </DownloadPdfLink>
          {generatedAt ? (
            <p className="font-brown text-ink-soft mt-2 text-xs tracking-[0.08em] uppercase">
              Generado {formatGuideDate(generatedAt)}
            </p>
          ) : null}
        </header>

        {mapView ? (
          <ZoneMap
            zoneSlug={zone.slug}
            zoneName={zone.name}
            view={mapView}
          />
        ) : null}

        {sectors.map((sector) => {
          const sectorWalls = walls.filter((wall) => wall.sectorId === sector.id);
          return (
            <section
              key={sector.id}
              id={`sector-${sector.slug}`}
              className="page-shell border-rule border-b py-12"
            >
              <p className="kicker">Sector</p>
              <h2 className="font-display mt-2 text-3xl">{sector.name}</h2>
              <ul className="mt-8 grid gap-6 md:grid-cols-2">
                {sectorWalls.map((wall) => {
                  const count = routes.filter((route) => route.wallId === wall.id)
                    .length;
                  return (
                    <li key={wall.id}>
                      <TrackedLink
                        href={`/deportiva/${zone.slug}/${sector.slug}/${wall.slug}`}
                        event="deportiva_wall_opened"
                        properties={{
                          zone: zone.slug,
                          sector: sector.slug,
                          wall: wall.slug,
                        }}
                        className="border-rule block border p-5"
                      >
                        <h3 className="font-display text-2xl">{wall.name}</h3>
                        <p className="font-brown text-ink-soft mt-2 text-sm">
                          {count} {count === 1 ? "ruta" : "rutas"}
                        </p>
                      </TrackedLink>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </article>
      <SiteFooter />
    </main>
  );
}
