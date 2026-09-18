import type { Metadata } from "next";
import DownloadPdfLink from "@/components/DownloadPdfLink";
import DeportivaBackLink from "@/components/climbing/DeportivaBackLink";
import DeportivaPageTransition from "@/components/climbing/DeportivaPageTransition";
import WallTopoExplorer from "@/components/climbing/WallTopoExplorer";
import { requireWallGuide } from "@/lib/guide/queries";
import { formatGuideDate } from "@/lib/guide/layout";
import { latestPdfDate } from "@/lib/guide/store";
import { pageMetadata } from "../../../../seo";

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
  return pageMetadata({
    title: `${data.wall.name} · ${data.zone.name}`,
    description: `Topo de ${data.wall.name} en ${data.zone.name}, Chile Chico.`,
    path: `/deportiva/${data.zone.slug}/${data.sector.slug}/${data.wall.slug}`,
  });
}

export default async function WallPage({ params }: WallPageProps) {
  const { zoneSlug, sectorSlug, wallSlug } = await params;
  const { zone, sector, wall, topos, routes, paths } = await requireWallGuide(
    zoneSlug,
    sectorSlug,
    wallSlug,
  );
  const generatedAt = await latestPdfDate(zone.id);

  return (
    <DeportivaPageTransition>
      <main className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <header className="page-shell border-rule relative z-30 flex shrink-0 items-center justify-between gap-3 border-b bg-paper py-2 md:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <DeportivaBackLink
              href={`/deportiva/${zone.slug}#sector-${sector.slug}`}
              to={zone.name}
              compact
            />
            <h1 className="font-display truncate text-2xl leading-none md:text-5xl">
              {wall.name}
            </h1>
          </div>
          <div className="shrink-0 text-right">
            <DownloadPdfLink
              href={`/deportiva/${zone.slug}/pdf?t=${generatedAt?.getTime() ?? Date.now()}`}
              event="deportiva_zone_pdf"
              properties={{ zone: zone.slug, wall: wall.slug }}
              className="font-brown text-[0.65rem] tracking-[0.12em] uppercase underline decoration-from-font underline-offset-4 md:text-sm md:tracking-[0.14em]"
            >
              Descargar topo
            </DownloadPdfLink>
            {generatedAt ? (
              <p className="font-brown text-ink-soft mt-0.5 hidden text-xs tracking-[0.08em] uppercase md:block">
                Generado {formatGuideDate(generatedAt)}
              </p>
            ) : null}
          </div>
        </header>
        <WallTopoExplorer topos={topos} routes={routes} paths={paths} />
      </main>
    </DeportivaPageTransition>
  );
}
