import type { Metadata } from "next";
import DownloadPdfLink from "@/components/DownloadPdfLink";
import SiteHeader from "@/components/SiteHeader";
import WallTopoExplorer from "@/components/climbing/WallTopoExplorer";
import { requireWallGuide } from "@/lib/guide/queries";
import { formatGuideDate } from "@/lib/guide/layout";
import { getStoredPdf, wallPdfId } from "@/lib/guide/store";

type WallPageProps = {
  params: Promise<{
    zoneSlug: string;
    sectorSlug: string;
    wallSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: WallPageProps): Promise<Metadata> {
  const { zoneSlug, sectorSlug, wallSlug } = await params;
  const data = await requireWallGuide(zoneSlug, sectorSlug, wallSlug);
  return {
    title: `${data.wall.name} · ${data.zone.name}`,
    description: `Topo de ${data.wall.name} en ${data.zone.name}.`,
  };
}

export default async function WallPage({ params }: WallPageProps) {
  const { zoneSlug, sectorSlug, wallSlug } = await params;
  const { zone, sector, wall, topos, routes, paths } = await requireWallGuide(
    zoneSlug,
    sectorSlug,
    wallSlug,
  );
  const storedPdf = await getStoredPdf(wallPdfId(wall.id));

  return (
    <main className="flex h-dvh flex-col overflow-hidden">
      <SiteHeader current="deportiva" />
      <header className="page-shell border-rule flex shrink-0 flex-col gap-3 border-b py-4 md:flex-row md:items-end md:justify-between md:py-5">
        <div>
          <p className="kicker">
            {zone.name} · {sector.name}
          </p>
          <h1 className="font-display mt-2 text-3xl md:text-5xl">{wall.name}</h1>
        </div>
        <div className="text-left md:text-right">
          <DownloadPdfLink
            href={`/deportiva/${zone.slug}/${sector.slug}/${wall.slug}/pdf`}
            event="deportiva_wall_pdf"
            properties={{ zone: zone.slug, wall: wall.slug }}
            className="font-brown text-sm tracking-[0.14em] uppercase underline decoration-from-font underline-offset-4"
          >
            PDF de esta pared
          </DownloadPdfLink>
          {storedPdf ? (
            <p className="font-brown text-ink-soft mt-1 text-xs tracking-[0.08em] uppercase">
              Generado {formatGuideDate(storedPdf.generatedAt)}
            </p>
          ) : null}
        </div>
      </header>
      <WallTopoExplorer topos={topos} routes={routes} paths={paths} />
    </main>
  );
}
