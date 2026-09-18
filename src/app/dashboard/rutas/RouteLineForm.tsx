"use client";

import { useMemo, useState } from "react";
import DrawForm from "../topos/DrawForm";

type Topo = {
  id: string;
  name: string | null;
  main: boolean;
  imageUrl: string;
  imagePublicId: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  routeStrokeWidth: number;
};

type Path = {
  id: string;
  topoId: string;
  path: string;
};

export default function RouteLineForm({
  routeId,
  topos,
  paths,
}: {
  routeId: string;
  topos: Topo[];
  paths: Path[];
}) {
  const initial =
    topos.find((topo) => topo.main)?.id ?? topos[0]?.id ?? "";
  const [topoId, setTopoId] = useState(initial);
  const topo = useMemo(
    () => topos.find((item) => item.id === topoId),
    [topos, topoId],
  );
  const current = paths.find((path) => path.topoId === topoId);

  if (!topo) {
    return (
      <p className="font-brown text-ink-soft text-sm">
        Esta pared todavía no tiene topo. Agrégalo en la pared para poder
        dibujar la línea.
      </p>
    );
  }

  return (
    <div>
      <label className="font-brown text-sm">
        En qué topo
        <select
          value={topoId}
          onChange={(event) => setTopoId(event.target.value)}
          className="border-rule mt-2 block w-full border px-3 py-2"
        >
          {topos.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name ?? "Topo"}
              {item.main ? " · principal" : ""}
              {paths.some((path) => path.topoId === item.id)
                ? " · con línea"
                : " · sin línea"}
            </option>
          ))}
        </select>
      </label>
      <DrawForm
        key={topo.id}
        topoId={topo.id}
        routeId={routeId}
        pathId={current?.id}
        initialPath={current?.path}
        imageUrl={topo.imageUrl}
        publicId={topo.imagePublicId}
        width={topo.imageWidth ?? 1600}
        height={topo.imageHeight ?? 1200}
        strokeWidth={topo.routeStrokeWidth}
      />
    </div>
  );
}
