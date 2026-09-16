"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import type { TopoData, TopoRoute } from "./types";
import WallExplorer from "./WallExplorer";
import TopoHeroBar from "./TopoHeroBar";

const DATA_URL = "/data/topo-apidame.json";

export default function TopoClient() {
  const [data, setData] = useState<TopoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  useEffect(() => {
    posthog.capture("topo_explorer_opened", { wall: "proa-repisa" });
  }, []);

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
          posthog.captureException(err);
          setError(err instanceof Error ? err.message : "Error desconocido");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const routes: TopoRoute[] = data?.routes ?? [];

  const handleSelectRoute = (id: string) => {
    setSelectedRouteId(id);
    const route = routes.find((item) => item.id === id);
    posthog.capture("topo_route_selected", {
      route_id: id,
      route_name: route?.name,
      grade: route?.grade,
      sector_id: route?.sectorId,
      wall: "proa-repisa",
    });
  };

  return (
    <section className="bg-canvas relative min-h-0 flex-1">
      <div className="pointer-events-auto absolute top-4 right-4 left-4 z-10 md:right-auto">
        <TopoHeroBar />
      </div>
      <div className="h-full min-h-0">
        <WallExplorer
          data={data}
          visibleRoutes={routes}
          selectedRouteId={selectedRouteId}
          onSelectRoute={handleSelectRoute}
          error={error}
        />
      </div>
    </section>
  );
}
