"use client";

import { useState } from "react";
import TopoCanvas from "@/components/climbing/TopoCanvas";

type TopoStrokeFieldProps = {
  topo: {
    id: string;
    name: string | null;
    position: number;
    imageUrl: string;
    imagePublicId: string | null;
    imageWidth: number | null;
    imageHeight: number | null;
    routeStrokeWidth: number;
  };
  routes: Array<{
    id: string;
    name: string;
    position: number;
    kind: string;
    grade: string | null;
  }>;
  paths: Array<{
    id: string;
    routeId: string;
    path: string;
    hideStart: boolean;
  }>;
};

export default function TopoStrokeField({
  topo,
  routes,
  paths,
}: TopoStrokeFieldProps) {
  const [value, setValue] = useState(topo.routeStrokeWidth);

  function clamp(next: number) {
    if (!Number.isFinite(next)) return value;
    return Math.min(3, Math.max(0.2, Math.round(next * 20) / 20));
  }

  return (
    <div className="grid gap-3">
      <input type="hidden" name="routeStrokeWidth" value={value} />
      <label className="font-brown text-sm">
        Grosor de línea ({value})
        <input
          type="range"
          min={0.2}
          max={3}
          step={0.05}
          value={value}
          onChange={(event) => setValue(clamp(Number(event.target.value)))}
          className="mt-2 block w-full"
        />
      </label>
      <label className="font-brown text-sm">
        Número
        <input
          type="number"
          min={0.2}
          max={3}
          step={0.05}
          value={value}
          onChange={(event) => setValue(clamp(Number(event.target.value)))}
          className="border-rule mt-1 block w-full border px-3 py-2"
        />
      </label>
      <p className="font-brown text-ink-soft text-xs leading-relaxed">
        1 es el default. Bájalo (0.3–0.6) si la foto está lejos. El PDF usa el
        mismo grosor.
      </p>
      <TopoCanvas
        topo={{ ...topo, routeStrokeWidth: value }}
        routes={routes}
        paths={paths}
        selectedRouteId={null}
        onSelectRoute={() => {}}
      />
    </div>
  );
}
