"use client";

import { useMemo } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import RouteMarkers from "@/components/climbing/RouteMarkers";
import { DIMMED_COLOR, SELECTED_COLOR, routeColor } from "@/lib/climbing/colors";
import { optimizedImageUrl } from "@/lib/climbing/cloudinary";
import { parsePath, strokeWidthPx } from "@/lib/climbing/path";

export type TopoViewRoute = {
  id: string;
  name: string;
  position: number;
  kind: string;
  grade: string | null;
};

export type TopoViewPath = {
  id: string;
  topoId?: string;
  routeId: string;
  path: string;
  hideStart: boolean;
};

export type TopoViewImage = {
  id: string;
  name: string | null;
  main?: boolean;
  position: number;
  imageUrl: string;
  imagePublicId: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  routeStrokeWidth: number;
};

type DrawnPath = TopoViewPath & {
  route: TopoViewRoute;
  points: { x: number; y: number }[];
};

type TopoCanvasProps = {
  topo: TopoViewImage;
  routes: TopoViewRoute[];
  paths: TopoViewPath[];
  selectedRouteId: string | null;
  onSelectRoute: (id: string | null) => void;
};

function pathStroke(
  kind: string,
  routeId: string,
  selectedRouteId: string | null,
) {
  if (selectedRouteId === routeId) return SELECTED_COLOR;
  if (selectedRouteId !== null) return DIMMED_COLOR;
  return routeColor(kind);
}

export default function TopoCanvas({
  topo,
  routes,
  paths,
  selectedRouteId,
  onSelectRoute,
}: TopoCanvasProps) {
  const width = topo.imageWidth ?? 1600;
  const height = topo.imageHeight ?? 1200;
  const stroke = strokeWidthPx(topo.routeStrokeWidth);
  const src = optimizedImageUrl(
    { url: topo.imageUrl, publicId: topo.imagePublicId },
    1800,
  );

  const drawn = useMemo(() => {
    const items: DrawnPath[] = [];
    for (const item of paths) {
      const route = routes.find((candidate) => candidate.id === item.routeId);
      if (!route) continue;
      const points = parsePath(item.path);
      if (points.length > 1) items.push({ ...item, route, points });
    }
    if (!selectedRouteId) return items;
    return [...items].sort((a, b) => {
      const aSel = a.route.id === selectedRouteId ? 1 : 0;
      const bSel = b.route.id === selectedRouteId ? 1 : 0;
      return aSel - bSel;
    });
  }, [paths, routes, selectedRouteId]);

  return (
    <div className="h-full min-h-0 w-full overflow-hidden bg-canvas">
      <TransformWrapper
        minScale={0.25}
        maxScale={6}
        fitOnInit
        limitToBounds
        centerZoomedOut
        wheel={{ step: 0.12 }}
        pinch={{ step: 6 }}
      >
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%", overflow: "hidden" }}
          contentStyle={{ width: "100%" }}
        >
          <div className="relative w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={topo.name ?? "Topo"}
              width={width}
              height={height}
              className="block h-auto w-full"
              draggable={false}
            />
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <rect
                width={width}
                height={height}
                fill="transparent"
                onClick={() => onSelectRoute(null)}
              />
              {drawn.map((item) => {
                const active = selectedRouteId === item.route.id;
                const color = pathStroke(
                  item.route.kind,
                  item.route.id,
                  selectedRouteId,
                );
                const start = item.points[0];
                const end = item.points[item.points.length - 1];
                const points = item.points
                  .map((point) => `${point.x},${point.y}`)
                  .join(" ");
                return (
                  <g
                    key={item.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectRoute(item.route.id);
                    }}
                    className="cursor-pointer"
                  >
                    <polyline
                      fill="none"
                      points={points}
                      stroke="transparent"
                      strokeWidth={Math.max(stroke * 8, 64)}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      fill="none"
                      points={points}
                      stroke={color}
                      strokeWidth={active ? stroke * 1.45 : stroke}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {!item.hideStart || end ? (
                      <RouteMarkers
                        start={start}
                        end={end}
                        hideStart={item.hideStart}
                        label={item.route.position}
                        color={color}
                        routeStrokeWidth={topo.routeStrokeWidth}
                      />
                    ) : null}
                  </g>
                );
              })}
            </svg>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
