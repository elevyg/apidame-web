"use client";

import type { TopoRoute, TopoSector } from "./types";

type RoutePanelProps = {
  sectors: TopoSector[];
  routes: TopoRoute[];
  allRoutes: TopoRoute[];
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  sectorId: string;
  onSectorChange: (value: string) => void;
};

export default function RoutePanel({
  sectors,
  routes,
  allRoutes,
  selectedRouteId,
  onSelectRoute,
  query,
  onQueryChange,
  sectorId,
  onSectorChange,
}: RoutePanelProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b-2 border-secondaryA/30 px-4 py-3">
        <h3 className="font-forgen text-xl text-primaryB">Rutas</h3>
        <p className="font-brown text-xs text-primaryB/60">
          {routes.length}/{allRoutes.length} rutas
        </p>
      </div>

      <div className="flex flex-col gap-3 border-b border-secondaryA/20 px-4 py-3">
        <label className="flex flex-col gap-2 text-xs font-brown text-primaryB/70">
          Buscar por nombre o grado
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="rounded border border-secondaryA/40 bg-transparent px-3 py-2 text-sm text-primaryB outline-none focus:border-secondaryA"
            placeholder="Ej: El Rayo, 7a"
          />
        </label>

        <label className="flex flex-col gap-2 text-xs font-brown text-primaryB/70">
          Sector
          <select
            value={sectorId}
            onChange={(event) => onSectorChange(event.target.value)}
            className="rounded border border-secondaryA/40 bg-primaryA px-3 py-2 text-sm text-primaryB outline-none focus:border-secondaryA"
          >
            <option value="all">Todos los sectores</option>
            {sectors.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 py-2">
        {routes.length === 0 ? (
          <div className="px-2 py-6 text-center text-xs font-brown text-primaryB/60">
            No hay rutas con esos filtros.
          </div>
        ) : (
          routes.map((route) => {
            const isSelected = route.id === selectedRouteId;
            const sector = sectors.find((s) => s.id === route.sectorId);
            return (
              <button
                key={route.id}
                type="button"
                onClick={() => onSelectRoute(route.id)}
                className={`flex w-full items-start justify-between gap-3 rounded border px-3 py-2 text-left transition ${
                  isSelected
                    ? "border-secondaryB/80 bg-secondaryB/10"
                    : "border-secondaryA/10 hover:border-secondaryA/60"
                }`}
              >
                <div>
                  <p className="font-forgen text-base text-primaryB">
                    {route.name}
                  </p>
                  <p className="font-brown text-xs text-primaryB/60">
                    {sector?.name ?? "Sector"}
                  </p>
                </div>
                <span className="rounded border border-secondaryA/40 px-2 py-1 text-xs font-brown text-secondaryA">
                  {route.grade}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
