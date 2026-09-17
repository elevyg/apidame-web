"use client";

import { useState } from "react";
import PathDrawer from "@/components/climbing/PathDrawer";
import { saveRoutePath } from "@/app/dashboard/actions";

type DrawFormProps = {
  topoId: string;
  routes: Array<{ id: string; name: string; position: number }>;
  paths: Array<{ id: string; routeId: string; path: string }>;
  imageUrl: string;
  publicId: string | null;
  width: number;
  height: number;
  strokeWidth: number;
};

export default function DrawForm({
  topoId,
  routes,
  paths,
  imageUrl,
  publicId,
  width,
  height,
  strokeWidth,
}: DrawFormProps) {
  const [routeId, setRouteId] = useState(routes[0]?.id ?? "");
  const current = paths.find((path) => path.routeId === routeId);
  const [path, setPath] = useState(current?.path ?? "");

  return (
    <form action={saveRoutePath} className="mt-8">
      <input type="hidden" name="topoId" value={topoId} />
      <input type="hidden" name="pathId" value={current?.id ?? ""} />
      <input type="hidden" name="path" value={path} />
      <label className="font-brown text-sm">
        Ruta
        <select
          name="routeId"
          value={routeId}
          onChange={(event) => {
            const next = event.target.value;
            setRouteId(next);
            setPath(paths.find((item) => item.routeId === next)?.path ?? "");
          }}
          className="border-rule mt-2 block w-full border px-3 py-2"
        >
          {routes.map((route) => (
            <option key={route.id} value={route.id}>
              {route.position}. {route.name}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-6">
        <PathDrawer
          key={routeId}
          imageUrl={imageUrl}
          publicId={publicId}
          width={width}
          height={height}
          strokeWidth={strokeWidth}
          initialPath={path}
          onChange={setPath}
        />
      </div>
      <button
        type="submit"
        className="font-brown border-rule mt-6 border px-4 py-2 text-sm tracking-[0.16em] uppercase"
      >
        Guardar línea
      </button>
    </form>
  );
}
