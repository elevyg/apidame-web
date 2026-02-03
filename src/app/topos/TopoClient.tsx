"use client";

import { useEffect, useState } from "react";
import type { TopoData, TopoRoute } from "./types";
import WallExplorer from "./WallExplorer";

const DATA_URL = "/data/topo-apidame.json";

export default function TopoClient() {
  const [data, setData] = useState<TopoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(DATA_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo cargar la data del topo");
        }
        return response.json();
      })
      .then((json) => {
        if (active) {
          setData(json);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Error desconocido");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const routes: TopoRoute[] = data?.routes ?? [];

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="y2k-panel flex min-h-[480px] flex-1 flex-col">
        <div className="flex flex-col gap-2 border-b-2 border-secondaryA/30 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-forgen text-2xl text-primaryB md:text-3xl">
              Topo Interactivo Proa y Repisa Central
            </h2>
            <p className="font-brown text-xs text-primaryB/60">
              Arrastra para mover · Pinch/scroll para zoom · Doble click para
              acercar
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-brown text-xs text-primaryB/50">
              estilo mapa
            </span>
            <div className="flex gap-1">
              <span className="h-3 w-3 rounded-full bg-secondaryA/50" />
              <span className="h-3 w-3 rounded-full bg-secondaryB/50" />
            </div>
          </div>
        </div>

        <div className="relative min-h-[320px] flex-1 p-(--spacing-panel) md:min-h-0">
          <div className="y2k-panel-sunken h-full w-full md:absolute md:inset-0 md:m-(--spacing-panel)">
            <WallExplorer
              data={data}
              visibleRoutes={routes}
              selectedRouteId={selectedRouteId}
              onSelectRoute={setSelectedRouteId}
              error={error}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
