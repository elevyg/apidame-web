"use client";

import { useMemo } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
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
  imageUrl: string;
  imagePublicId: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  routeStrokeWidth: number;
};

type TopoCanvasProps = {
  topo: TopoViewImage;
  routes: TopoViewRoute[];
  paths: TopoViewPath[];
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
};

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

  const drawn = useMemo(
    () =>
      paths
        .map((item) => {
          const route = routes.find((candidate) => candidate.id === item.routeId);
          return route
            ? { ...item, route, points: parsePath(item.path) }
            : null;
        })
        .filter((item) => item && item.points.length > 1),
    [paths, routes],
  );

  return (
    <div className="bg-canvas h-full overflow-hidden">
      <TransformWrapper
        minScale={1}
        maxScale={6}
        centerOnInit
        limitToBounds
        wheel={{ step: 0.12 }}
        pinch={{ step: 6 }}
      >
        <TransformComponent
          wrapperClass="!h-full !w-full"
          contentClass="!h-full !w-full"
        >
          <div className="relative h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={topo.name ?? "Topo"}
              className="absolute inset-0 h-full w-full object-contain"
              draggable={false}
            />
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {drawn.map((item) => {
                if (!item) return null;
                const active = selectedRouteId === item.route.id;
                const dimmed = selectedRouteId !== null && !active;
                const color = dimmed
                  ? DIMMED_COLOR
                  : active
                    ? SELECTED_COLOR
                    : routeColor(item.route.kind);
                const start = item.points[0];
                const end = item.points[item.points.length - 1];
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
                      points={item.points
                        .map((point) => `${point.x},${point.y}`)
                        .join(" ")}
                      stroke={color}
                      strokeWidth={stroke}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {!item.hideStart && start ? (
                      <g>
                        <circle
                          cx={start.x}
                          cy={start.y}
                          r={stroke * 1.15}
                          fill={color}
                        />
                        <text
                          x={start.x}
                          y={start.y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#fff"
                          fontSize={stroke * 1.1}
                          fontFamily="ui-sans-serif, system-ui, sans-serif"
                        >
                          {item.route.position}
                        </text>
                      </g>
                    ) : null}
                    {end ? (
                      <circle
                        cx={end.x}
                        cy={end.y}
                        r={stroke * 0.55}
                        fill={color}
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
