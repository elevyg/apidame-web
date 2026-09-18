"use client";

import { useState } from "react";
import PathDrawer from "@/components/climbing/PathDrawer";
import { saveRoutePath } from "@/app/dashboard/actions";

type DrawFormProps = {
  topoId: string;
  routeId: string;
  pathId?: string;
  initialPath?: string;
  imageUrl: string;
  publicId: string | null;
  width: number;
  height: number;
  strokeWidth: number;
};

export default function DrawForm({
  topoId,
  routeId,
  pathId,
  initialPath = "",
  imageUrl,
  publicId,
  width,
  height,
  strokeWidth,
}: DrawFormProps) {
  const [path, setPath] = useState(initialPath);

  return (
    <form action={saveRoutePath} className="mt-6">
      <input type="hidden" name="topoId" value={topoId} />
      <input type="hidden" name="routeId" value={routeId} />
      <input type="hidden" name="pathId" value={pathId ?? ""} />
      <input type="hidden" name="path" value={path} />
      <PathDrawer
        key={`${topoId}-${routeId}`}
        imageUrl={imageUrl}
        publicId={publicId}
        width={width}
        height={height}
        strokeWidth={strokeWidth}
        initialPath={path}
        onChange={setPath}
      />
      <button
        type="submit"
        className="font-brown border-rule mt-6 border px-4 py-2 text-sm tracking-[0.16em] uppercase"
      >
        Guardar línea
      </button>
    </form>
  );
}
