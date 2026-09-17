"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import TopoCanvas, {
  type TopoViewImage,
  type TopoViewPath,
  type TopoViewRoute,
} from "@/components/climbing/TopoCanvas";
import { routeColor, routeMeta, SELECTED_COLOR } from "@/lib/climbing/colors";

type ExplorerRoute = TopoViewRoute & {
  description: string | null;
  length: number | null;
  lengthUnit: string | null;
};

type WallTopoExplorerProps = {
  topos: TopoViewImage[];
  routes: ExplorerRoute[];
  paths: TopoViewPath[];
};

function topoTabLabel(item: TopoViewImage, topos: TopoViewImage[]) {
  const name = item.name?.trim() || "Topo";
  const twins = topos.filter((topo) => (topo.name?.trim() || "Topo") === name);
  if (twins.length < 2) return name;
  return `${name} ${twins.findIndex((topo) => topo.id === item.id) + 1}`;
}

function scrollItemInContainer(scroller: HTMLElement, item: HTMLElement) {
  const scrollerRect = scroller.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  const pad = 8;
  const visible =
    itemRect.top >= scrollerRect.top + pad &&
    itemRect.bottom <= scrollerRect.bottom - pad;
  if (visible) return;
  const offset =
    itemRect.top -
    scrollerRect.top -
    (scrollerRect.height - itemRect.height) / 2;
  scroller.scrollTo({
    top: Math.max(0, scroller.scrollTop + offset),
    behavior: "smooth",
  });
}

export default function WallTopoExplorer({
  topos,
  routes,
  paths,
}: WallTopoExplorerProps) {
  const ordered = useMemo(
    () =>
      [...topos].sort((a, b) => {
        if (a.main === b.main) return a.position - b.position;
        return a.main ? -1 : 1;
      }),
    [topos],
  );
  const [topoId, setTopoId] = useState(ordered[0]?.id ?? null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLElement>());
  const topo = ordered.find((item) => item.id === topoId) ?? ordered[0];
  const topoPaths = paths.filter((path) =>
    topo ? path.topoId === topo.id : false,
  );
  const numbered = [...routes].sort((a, b) => a.position - b.position);
  const topoRatio = `${topo?.imageWidth ?? 4} / ${topo?.imageHeight ?? 3}`;

  function selectRoute(id: string | null) {
    setSelectedRouteId((current) =>
      id === null ? null : current === id ? null : id,
    );
  }

  useEffect(() => {
    if (!selectedRouteId) return;
    const item = itemRefs.current.get(selectedRouteId);
    const scroller = listRef.current;
    if (!item || !scroller) return;
    scrollItemInContainer(scroller, item);
  }, [selectedRouteId]);

  if (!topo) {
    return (
      <p className="font-brown text-ink-soft page-shell py-16 text-sm">
        Esta pared todavía no tiene topo dibujado.
      </p>
    );
  }

  return (
    <div className="isolate flex min-h-0 flex-1 flex-col overflow-hidden md:grid md:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.7fr)]">
      <div className="relative z-20 flex min-h-0 max-h-[calc(100%-9rem)] flex-col overflow-hidden bg-canvas md:max-h-none md:h-full">
        {ordered.length > 1 ? (
          <div className="border-rule z-20 shrink-0 border-b bg-paper">
            <div className="flex gap-2 overflow-x-auto overscroll-x-contain px-3 py-2">
              {ordered.map((item) => {
                const active = item.id === topo.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setTopoId(item.id);
                      setSelectedRouteId(null);
                    }}
                    className={`font-brown shrink-0 px-3 py-1.5 text-sm tracking-[0.08em] whitespace-nowrap uppercase ${
                      active
                        ? "bg-ink text-paper"
                        : "border-rule text-ink border bg-paper"
                    }`}
                  >
                    {topoTabLabel(item, ordered)}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
        <div
          className="relative min-h-0 w-full overflow-hidden bg-canvas max-md:[aspect-ratio:var(--topo-ar)] md:flex-1"
          style={{ "--topo-ar": topoRatio } as CSSProperties}
        >
          <TopoCanvas
            key={topo.id}
            topo={topo}
            routes={routes}
            paths={topoPaths}
            selectedRouteId={selectedRouteId}
            onSelectRoute={selectRoute}
          />
        </div>
      </div>
      <aside className="border-rule relative z-0 min-h-0 flex-1 overflow-hidden border-t bg-paper md:border-t-0 md:border-l">
        <div
          ref={listRef}
          className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-y-contain"
        >
          <ol>
            {numbered.map((route) => {
              const active = route.id === selectedRouteId;
              const color = active ? SELECTED_COLOR : routeColor(route.kind);
              return (
                <li
                  key={route.id}
                  className="border-rule border-b"
                  ref={(node) => {
                    if (node) itemRefs.current.set(route.id, node);
                    else itemRefs.current.delete(route.id);
                  }}
                >
                  <button
                    type="button"
                    onClick={() => selectRoute(route.id)}
                    className={`flex w-full items-start gap-3 px-4 py-4 text-left ${
                      active ? "bg-beige" : ""
                    }`}
                  >
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white text-sm font-semibold"
                      style={{ borderColor: color, color }}
                    >
                      {route.position}
                    </span>
                    <span className="min-w-0">
                      <span className="font-display block text-xl leading-tight">
                        {route.name}
                      </span>
                      <span className="font-brown text-ink-soft mt-1 block text-sm">
                        {routeMeta(route)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </aside>
    </div>
  );
}
