"use client";

import { useState } from "react";
import TopoCanvas, {
  type TopoViewImage,
  type TopoViewPath,
  type TopoViewRoute,
} from "@/components/climbing/TopoCanvas";

type WallTopoExplorerProps = {
  topos: TopoViewImage[];
  routes: TopoViewRoute[];
  paths: TopoViewPath[];
};

export default function WallTopoExplorer({
  topos,
  routes,
  paths,
}: WallTopoExplorerProps) {
  const main = topos.find((topo) => topo.main) ?? topos[0];
  const [topoId, setTopoId] = useState(main?.id ?? topos[0]?.id ?? "");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const topo = topos.find((item) => item.id === topoId) ?? topos[0];
  if (!topo) return null;
  const topoPaths = paths.filter((path) => path.topoId === topo.id);

  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      {topos.length > 1 ? (
        <div className="border-rule flex shrink-0 gap-4 overflow-x-auto border-b px-4 py-3 md:hidden">
          {topos.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTopoId(item.id)}
              className={`font-brown shrink-0 text-xs tracking-[0.14em] uppercase ${
                item.id === topo.id ? "text-ink" : "text-ink-soft"
              }`}
            >
              {item.name ?? "Topo"}
            </button>
          ))}
        </div>
      ) : null}
      <div className="min-h-0 min-w-0 flex-1">
        <TopoCanvas
          topo={topo}
          routes={routes}
          paths={topoPaths}
          selectedRouteId={selectedRouteId}
          onSelectRoute={(id) =>
            setSelectedRouteId((current) => (current === id ? null : id))
          }
        />
      </div>
      <aside className="border-rule flex max-h-[32dvh] shrink-0 flex-col overflow-hidden border-t md:max-h-none md:w-80 md:border-t-0 md:border-l">
        {topos.length > 1 ? (
          <div className="border-rule hidden gap-3 overflow-x-auto border-b px-4 py-3 md:flex">
            {topos.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTopoId(item.id)}
                className={`font-brown shrink-0 text-xs tracking-[0.14em] uppercase ${
                  item.id === topo.id ? "text-ink" : "text-ink-soft"
                }`}
              >
                {item.name ?? "Topo"}
              </button>
            ))}
          </div>
        ) : null}
        <ol className="divide-rule min-h-0 flex-1 divide-y overflow-y-auto">
          {routes.map((route) => {
            const active = selectedRouteId === route.id;
            return (
              <li key={route.id}>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedRouteId((current) =>
                      current === route.id ? null : route.id,
                    )
                  }
                  className={`flex w-full items-baseline justify-between gap-4 px-4 py-3 text-left ${
                    active ? "bg-beige" : "bg-paper"
                  }`}
                >
                  <span className="font-display text-lg">
                    {route.position}. {route.name}
                  </span>
                  <span className="font-brown text-ink-soft text-sm">
                    {route.grade ?? route.kind}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>
    </div>
  );
}
