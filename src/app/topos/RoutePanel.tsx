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
    <div className="flex min-h-0 flex-1 flex-col bg-paper">
      <div className="border-b border-rule px-4 py-3">
        <h3 className="font-display text-xl">Rutas</h3>
        <p className="font-brown text-xs text-ink-soft">
          {routes.length}/{allRoutes.length} rutas
        </p>
      </div>

      <div className="flex flex-col gap-3 border-b border-rule px-4 py-3">
        <label className="flex flex-col gap-2 font-brown text-xs text-ink-soft">
          Buscar por nombre o grado
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="border border-rule bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            placeholder="Ej: El Rayo, 7a"
          />
        </label>

        <label className="flex flex-col gap-2 font-brown text-xs text-ink-soft">
          Sector
          <select
            value={sectorId}
            onChange={(event) => onSectorChange(event.target.value)}
            className="border border-rule bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
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
          <div className="px-2 py-6 text-center font-brown text-xs text-ink-soft">
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
                className={`flex w-full items-start justify-between gap-3 border-b border-rule px-3 py-3 text-left ${
                  isSelected ? "bg-paper-deep" : "hover:bg-paper-deep/60"
                }`}
              >
                <div>
                  <p className="font-brown text-sm text-ink">{route.name}</p>
                  <p className="font-brown text-xs text-ink-soft">
                    {sector?.name ?? "Sector"}
                  </p>
                </div>
                <span className="font-brown text-xs text-ink-soft">
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
