"use client";

import { useEffect, useState } from "react";
import type { TopoData, TopoRoute } from "./types";
import WallExplorer from "./WallExplorer";
import TopoHeroBar from "./TopoHeroBar";

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
      <div className="y2k-panel y2k-noise flex min-h-[520px] flex-1 flex-col">
        <div className="relative flex min-h-0 flex-1">
          <div className="pointer-events-auto absolute left-4 top-4 z-10">
            <TopoHeroBar />
          </div>

          <div className="y2k-panel-sunken h-full w-full">
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
