"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import posthog from "posthog-js";
import type { FeaturedRoute } from "./types";
import PdfViewerModal from "./PdfViewerModal";

type FeaturedRoutesGalleryProps = {
  routes: FeaturedRoute[];
};

function formatUpdated(dateValue: string | null) {
  if (!dateValue) return "Actualización reciente";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Actualización reciente";
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function displayName(name: string) {
  return name.replace(/\.pdf$/i, "");
}

export default function FeaturedRoutesGallery({
  routes,
}: FeaturedRoutesGalleryProps) {
  const [activeRoute, setActiveRoute] = useState<FeaturedRoute | null>(null);
  const displayedRoutes = useMemo(() => routes.slice(0, 20), [routes]);

  if (displayedRoutes.length === 0) {
    return (
      <div className="page-shell font-brown text-ink-soft py-16 text-sm">
        Pronto habrá rutas destacadas aquí.
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-6 overflow-x-auto px-5 pb-4 md:px-8">
        {displayedRoutes.map((route) => (
          <button
            key={route.id}
            type="button"
            onClick={() => {
              setActiveRoute(route);
              posthog.capture("topo_pdf_opened", {
                route_name: displayName(route.name),
                file_id: route.id,
              });
            }}
            className="w-[220px] shrink-0 text-left md:w-[260px]"
          >
            <div className="bg-paper-deep relative aspect-[4/3] overflow-hidden">
              {route.thumbnail ? (
                <Image
                  src={route.thumbnail}
                  alt={`Miniatura de ${displayName(route.name)}`}
                  className="object-cover"
                  fill
                  sizes="260px"
                />
              ) : (
                <div className="font-brown text-ink-soft flex h-full items-center justify-center text-xs">
                  Topo PDF
                </div>
              )}
            </div>
            <p className="font-brown mt-3 text-sm leading-snug">
              {displayName(route.name)}
            </p>
            <p className="kicker mt-2">{formatUpdated(route.modifiedTime)}</p>
          </button>
        ))}
      </div>

      <PdfViewerModal
        isOpen={Boolean(activeRoute)}
        title={displayName(activeRoute?.name ?? "Topo")}
        fileId={activeRoute?.id ?? ""}
        onClose={() => setActiveRoute(null)}
      />
    </>
  );
}
