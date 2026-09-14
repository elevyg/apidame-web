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
    <section className="relative min-h-0 flex-1 bg-canvas">
      <div className="pointer-events-auto absolute top-4 left-4 z-10 right-4 md:right-auto">
        <TopoHeroBar />
      </div>
      <div className="h-full min-h-0">
        <WallExplorer
          data={data}
          visibleRoutes={routes}
          selectedRouteId={selectedRouteId}
          onSelectRoute={setSelectedRouteId}
          error={error}
        />
      </div>
    </section>
  );
}
