"use client";

import { useState } from "react";

export default function TopoHeroBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-auto max-w-[320px] border border-white/25 bg-canvas/80 px-4 py-3 text-canvas-ink backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="kicker text-white/55">Cerro Apidame</p>
          <h2 className="font-display mt-1 text-lg text-canvas-ink">
            Proa y Repisa Central
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="font-brown text-[10px] tracking-[0.18em] text-white/70 uppercase hover:text-canvas-ink"
        >
          {open ? "Cerrar" : "Ayuda"}
        </button>
      </div>
      {open ? (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-brown text-[10px] tracking-[0.16em] text-white/70 uppercase">
          <span>Arrastra</span>
          <span>Pinch / scroll</span>
          <span>Doble tap</span>
        </div>
      ) : null}
    </div>
  );
}
