"use client";

import { useEffect, useMemo, useState } from "react";
import type { TopoData, TopoRoute, TopoSector } from "./types";
import WallExplorer from "./WallExplorer";
import RoutePanel from "./RoutePanel";

const DATA_URL = "/data/topo-apidame.json";

export default function TopoClient() {
  const [data, setData] = useState<TopoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sectorId, setSectorId] = useState("all");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);

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

  const sectors: TopoSector[] = data?.sectors ?? [];
  const routes: TopoRoute[] = data?.routes ?? [];

  const filteredRoutes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return routes.filter((route) => {
      const matchesSector = sectorId === "all" || route.sectorId === sectorId;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${route.name} ${route.grade}`.toLowerCase().includes(normalizedQuery);
      return matchesSector && matchesQuery;
    });
  }, [routes, sectorId, query]);

  useEffect(() => {
    if (!selectedRouteId) return;
    const stillVisible = filteredRoutes.some(
      (route) => route.id === selectedRouteId,
    );
    if (!stillVisible) {
      setSelectedRouteId(null);
    }
  }, [filteredRoutes, selectedRouteId]);

  const totalCount = routes.length;
  const visibleCount = filteredRoutes.length;

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex items-center justify-between gap-3 md:hidden">
        <h2 className="font-forgen text-lg text-primaryB">Mapa y rutas</h2>
        <button
          type="button"
          className="rounded border border-secondaryA/60 px-3 py-1 text-xs font-brown text-secondaryA"
          onClick={() => setPanelOpen((prev) => !prev)}
        >
          {panelOpen ? "Ocultar" : "Mostrar"} panel
        </button>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-[minmax(0,1fr)_360px]">
        <div className="y2k-panel flex min-h-[320px] flex-1 flex-col">
          <div className="flex items-center justify-between border-b-2 border-secondaryA/30 px-4 py-3">
            <div>
              <h2 className="font-forgen text-2xl text-primaryB md:text-3xl">
                Topo interactivo
              </h2>
              <p className="font-brown text-xs text-primaryB/60">
                {visibleCount}/{totalCount} rutas visibles
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-brown text-xs text-primaryB/50">
                ↕ scroll
              </span>
              <div className="flex gap-1">
                <span className="h-3 w-3 rounded-full bg-secondaryA/50" />
                <span className="h-3 w-3 rounded-full bg-secondaryB/50" />
              </div>
            </div>
          </div>

          <div className="relative min-h-0 flex-1 p-(--spacing-panel)">
            <div className="y2k-panel-sunken absolute inset-0 m-(--spacing-panel)">
              <WallExplorer
                data={data}
                visibleRoutes={filteredRoutes}
                selectedRouteId={selectedRouteId}
                onSelectRoute={setSelectedRouteId}
                error={error}
              />
            </div>
          </div>
        </div>

        <div
          className={`y2k-panel min-h-0 flex-1 flex-col ${
            panelOpen ? "flex" : "hidden"
          } md:flex`}
        >
          <RoutePanel
            sectors={sectors}
            routes={filteredRoutes}
            allRoutes={routes}
            selectedRouteId={selectedRouteId}
            onSelectRoute={setSelectedRouteId}
            query={query}
            onQueryChange={setQuery}
            sectorId={sectorId}
            onSectorChange={setSectorId}
          />
        </div>
      </div>
    </section>
  );
}
