"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import RouteMarkers from "@/components/climbing/RouteMarkers";
import { optimizedImageUrl } from "@/lib/climbing/cloudinary";
import { parsePath, serializePath, strokeWidthPx, type Point } from "@/lib/climbing/path";
import { routeColor } from "@/lib/climbing/colors";

type PathDrawerProps = {
  imageUrl: string;
  publicId: string | null;
  width: number;
  height: number;
  strokeWidth: number;
  initialPath?: string;
  onChange: (path: string) => void;
};

export default function PathDrawer({
  imageUrl,
  publicId,
  width,
  height,
  strokeWidth,
  initialPath,
  onChange,
}: PathDrawerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<Point[]>(() => parsePath(initialPath));
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const src = optimizedImageUrl({ url: imageUrl, publicId }, 1800);
  const stroke = strokeWidthPx(strokeWidth);
  const d = useMemo(
    () => points.map((point) => `${point.x},${point.y}`).join(" "),
    [points],
  );

  useEffect(() => {
    onChangeRef.current(serializePath(points));
  }, [points]);

  function toImagePoint(event: React.PointerEvent<SVGSVGElement>): Point | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const x = ((event.clientX - rect.left) / rect.width) * width;
    const y = ((event.clientY - rect.top) / rect.height) * height;
    return { x, y };
  }

  return (
    <div>
      <div
        className="border-rule relative overflow-hidden border bg-canvas"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Topo para dibujar"
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0 h-full w-full touch-none"
          preserveAspectRatio="xMidYMid meet"
          onPointerDown={(event) => {
            const point = toImagePoint(event);
            if (!point) return;
            setPoints((current) => [...current, point]);
          }}
        >
          {points.length > 1 ? (
            <polyline
              fill="none"
              points={d}
              stroke={routeColor("Sport")}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
          {points.map((point, index) =>
            index === 0 || index === points.length - 1 ? null : (
              <circle
                key={`${point.x}-${point.y}-${index}`}
                cx={point.x}
                cy={point.y}
                r={stroke * 0.45}
                fill={routeColor("Sport")}
              />
            ),
          )}
          {points.length > 0 ? (
            <RouteMarkers
              start={points[0]}
              end={points.length > 1 ? points[points.length - 1] : undefined}
              label="+"
              color={routeColor("Sport")}
              routeStrokeWidth={strokeWidth}
            />
          ) : null}
        </svg>
      </div>
      <div className="mt-4 flex gap-4">
        <button
          type="button"
          className="font-brown text-xs tracking-[0.16em] uppercase underline decoration-from-font underline-offset-4"
          onClick={() => setPoints((current) => current.slice(0, -1))}
        >
          Deshacer
        </button>
        <button
          type="button"
          className="font-brown text-xs tracking-[0.16em] uppercase underline decoration-from-font underline-offset-4"
          onClick={() => setPoints([])}
        >
          Borrar línea
        </button>
      </div>
    </div>
  );
}
