"use client";

import { useState } from "react";
import TrackedLink from "@/components/TrackedLink";
import type { ZoneMapView } from "@/lib/guide/mapView";
import { directionsUrl } from "@/lib/guide/zoneMap";

type ZoneMapProps = {
  zoneSlug: string;
  zoneName: string;
  view: ZoneMapView;
};

export default function ZoneMap({ zoneSlug, zoneName, view }: ZoneMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    view.pins.length === 1 ? (view.pins[0]?.id ?? null) : null,
  );
  const selected = view.pins.find((pin) => pin.id === selectedId) ?? null;
  const origin = view.pins[0];

  return (
    <section id="mapa" className="page-shell border-rule border-b py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Mapa</p>
          <h2 className="font-display mt-2 text-3xl">Sectores y paredes</h2>
        </div>
        {origin ? (
          <a
            href={directionsUrl(origin.latitude, origin.longitude)}
            target="_blank"
            rel="noreferrer"
            className="font-brown text-sm tracking-[0.14em] uppercase underline decoration-from-font underline-offset-4"
          >
            Cómo llegar
          </a>
        ) : null}
      </div>
      <p className="font-brown text-ink-soft mt-4 max-w-xl text-sm leading-relaxed">
        Cada número es un sector. Las paredes de un mismo sector quedan en el
        mismo pin; tócalo para verlas.
      </p>

      <div className="border-rule relative mt-8 overflow-hidden border bg-canvas">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/deportiva/${zoneSlug}/mapa`}
          alt={`Mapa de ${zoneName}`}
          width={view.width}
          height={view.height}
          className="block h-auto w-full"
        />
        {view.pins.map((pin) => {
          const active = pin.id === selectedId;
          return (
            <button
              key={pin.id}
              type="button"
              onClick={() =>
                setSelectedId((current) =>
                  current === pin.id ? null : pin.id,
                )
              }
              className="absolute inline-flex -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${(pin.x / view.width) * 100}%`,
                top: `${(pin.y / view.height) * 100}%`,
              }}
              aria-pressed={active}
              aria-label={`Sector ${pin.number}: ${pin.name}`}
            >
              <span
                className={`font-brown inline-flex size-8 min-h-8 min-w-8 flex-none items-center justify-center rounded-full border-2 text-sm font-semibold leading-none tabular-nums ${
                  active
                    ? "border-paper bg-signal text-paper"
                    : "border-signal bg-paper text-signal"
                }`}
              >
                {pin.number}
              </span>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="border-rule mt-4 border p-5">
          <p className="kicker">
            Sector {selected.number}
          </p>
          <h3 className="font-display mt-2 text-2xl">{selected.name}</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {selected.walls.map((wall) => (
              <li key={wall.href}>
                <TrackedLink
                  href={wall.href}
                  event="deportiva_map_wall"
                  properties={{ zone: zoneSlug, wall: wall.slug }}
                  transitionTypes={["nav-forward"]}
                  className="border-rule font-brown hover:bg-beige inline-block border px-3 py-2 text-sm"
                >
                  {wall.name}
                  <span className="text-ink-soft"> · {wall.routes}</span>
                </TrackedLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <ol className="mt-8 grid gap-3 md:grid-cols-2">
        {view.pins.map((pin) => (
          <li key={pin.id}>
            <button
              type="button"
              onClick={() => setSelectedId(pin.id)}
              className="font-brown flex w-full min-w-0 items-start gap-3 text-left"
            >
              <span className="border-signal text-signal mt-0.5 inline-flex size-7 min-h-7 min-w-7 flex-none items-center justify-center rounded-full border text-sm leading-none tabular-nums">
                {pin.number}
              </span>
              <span className="min-w-0">
                <span className="block text-base">{pin.name}</span>
                <span className="text-ink-soft block text-sm">
                  {pin.walls.map((wall) => wall.name).join(" · ")}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="font-brown text-ink-soft mt-6 text-xs tracking-[0.08em] uppercase">
        Mapa © Mapbox © OpenStreetMap
      </p>
    </section>
  );
}
