"use client";

import { useState } from "react";

export default function TopoHeroBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-auto inline-flex max-w-[90%] flex-col gap-2 rounded border border-secondaryA/60 bg-primaryA/90 px-3 py-2 text-xs text-primaryB shadow-[0_0_18px_rgba(89,248,232,0.25)] backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-secondaryA/70" />
          <h2 className="font-forgen text-base text-primaryB">
            Proa &amp; Repisa Central
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="rounded border border-secondaryA/60 px-2 py-1 text-[10px] font-brown uppercase tracking-[0.2em] text-secondaryA hover:border-secondaryB hover:text-secondaryB"
        >
          {open ? "Cerrar" : "Ayuda"}
        </button>
      </div>
      <p className="font-brown text-[10px] text-primaryB/60">
        Explora con zoom y ubica tus líneas favoritas.
      </p>
      {open ? (
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-brown uppercase tracking-[0.2em] text-secondaryA/80">
          <span>Arrastra</span>
          <span>Pinch/Scroll</span>
          <span>Doble tap</span>
        </div>
      ) : null}
    </div>
  );
}
