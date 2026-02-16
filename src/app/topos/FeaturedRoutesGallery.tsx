"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { FeaturedRoute } from "./types";
import PdfViewerModal from "./PdfViewerModal";

type FeaturedRoutesGalleryProps = {
  routes: FeaturedRoute[];
};

function formatUpdated(dateValue: string | null) {
  if (!dateValue) return "Actualización reciente";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Actualización reciente";
  return `Actualizado ${date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
  })}`;
}

export default function FeaturedRoutesGallery({
  routes,
}: FeaturedRoutesGalleryProps) {
  const [activeRoute, setActiveRoute] = useState<FeaturedRoute | null>(null);

  const displayedRoutes = useMemo(() => routes.slice(0, 20), [routes]);

  if (displayedRoutes.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-center text-xs font-brown text-primaryB/60">
        Pronto habrá rutas destacadas aquí.
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-primaryA via-primaryA/80 to-transparent" />
        <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-2 text-[10px] font-brown uppercase tracking-[0.3em] text-secondaryA/70">
          <span className="h-1 w-1 rounded-full bg-secondaryA/70" />
          Scroll
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2">
          {displayedRoutes.map((route, index) => {
            const isFeatured = index === 0;
            return (
            <button
              key={route.id}
              type="button"
              onClick={() => setActiveRoute(route)}
              className={`y2k-panel y2k-noise relative flex min-w-[240px] flex-col gap-3 border px-3 py-3 text-left transition md:min-w-[280px] ${
                isFeatured
                  ? "y2k-featured-card border-secondaryB/80"
                  : "border-secondaryA/40 hover:border-secondaryB"
              }`}
            >
              {isFeatured ? (
                <div className="y2k-spotlight absolute -inset-6 -z-10" />
              ) : null}
              <div className="y2k-frame h-36 w-full overflow-hidden bg-black/30">
                {route.thumbnail ? (
                  <Image
                    src={route.thumbnail}
                    alt={`Miniatura ${route.name}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    fill
                    sizes="(max-width: 768px) 240px, 280px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] font-brown text-primaryB/40">
                    Topo PDF
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-forgen text-base text-primaryB">
                  {route.name}
                </p>
                <div className="flex items-center justify-between text-[10px] font-brown uppercase tracking-[0.2em] text-secondaryA/70">
                  <span>Topo PDF</span>
                  <span>{formatUpdated(route.modifiedTime)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-brown text-primaryB/70">
                <span className={isFeatured ? "text-secondaryB" : ""}>
                  Ver topo
                </span>
                <span className={isFeatured ? "text-secondaryB" : "text-secondaryA"}>
                  →
                </span>
              </div>
            </button>
          );
          })}
        </div>
      </div>

      <PdfViewerModal
        isOpen={Boolean(activeRoute)}
        title={activeRoute?.name ?? "Topo"}
        fileId={activeRoute?.id ?? ""}
        onClose={() => setActiveRoute(null)}
      />
    </>
  );
}
