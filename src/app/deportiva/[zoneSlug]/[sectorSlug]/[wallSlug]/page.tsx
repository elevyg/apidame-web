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
      <header className="page-shell border-rule flex shrink-0 items-baseline justify-between gap-3 border-b py-2 md:items-end md:py-5">
        <div className="min-w-0">
          <p className="font-brown text-ink-soft truncate text-[0.65rem] tracking-[0.14em] uppercase md:text-[1.25rem]">
            {zone.name} · {sector.name}
          </p>
          <h1 className="font-display mt-0.5 text-2xl leading-none md:mt-2 md:text-5xl">
            {wall.name}
          </h1>
        </div>
        <div className="shrink-0 text-right">
          <DownloadPdfLink
            href={`/deportiva/${zone.slug}/${sector.slug}/${wall.slug}/pdf?t=${storedPdf?.generatedAt.getTime() ?? Date.now()}`}
            event="deportiva_wall_pdf"
            properties={{ zone: zone.slug, wall: wall.slug }}
            className="font-brown text-[0.65rem] tracking-[0.12em] uppercase underline decoration-from-font underline-offset-4 md:text-sm md:tracking-[0.14em]"
          >
            PDF de esta pared
          </DownloadPdfLink>
          {storedPdf ? (
            <p className="font-brown text-ink-soft mt-0.5 hidden text-xs tracking-[0.08em] uppercase md:block">
              Generado {formatGuideDate(storedPdf.generatedAt)}
            </p>
          ) : null}
        </div>
      </header>
      <WallTopoExplorer topos={topos} routes={routes} paths={paths} />
    </main>
  );
}
