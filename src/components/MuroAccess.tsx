"use client";

import { useState } from "react";
import Logo from "assets/svgs/icon-solo.svg";

const prices = [
  { label: "Diario", value: "$5.000" },
  { label: "Socios CACHCH", value: "$2.000" },
  { label: "Mensualidad", value: "$25.000" },
];

export default function MuroAccess() {
  const [mapLive, setMapLive] = useState(false);

  return (
    <div className="border-rule flex flex-1 flex-col justify-center border-t">
      <div className="page-shell grid gap-12 py-14 md:grid-cols-2 md:gap-16 md:py-20">
        <div>
          <p className="kicker">Muro de escalada</p>
          <h2 className="font-display mt-3 text-3xl md:text-5xl">
            Horarios y acceso
          </h2>
          <p className="font-brown text-ink-soft mt-5 text-base leading-relaxed">
            Camino Internacional, a 200 metros del límite urbano de Chile Chico.
            Agenda por Instagram:{" "}
            <a
              className="text-ink underline decoration-from-font underline-offset-4"
              href="https://www.instagram.com/apidameboulder/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @apidameboulder
            </a>
          </p>

          <dl className="divide-rule border-rule mt-8 divide-y border-y">
            {prices.map((item) => (
              <div
                key={item.label}
                className="flex items-baseline justify-between gap-6 py-4"
              >
                <dt className="font-brown text-sm md:text-base">
                  {item.label}
                </dt>
                <dd className="font-brown text-sm md:text-base">
                  {item.value}
                </dd>
              </div>
            ))}
            <div className="flex flex-col gap-2 py-4">
              <dt className="font-brown text-sm md:text-base">Membresía</dt>
              <dd className="font-brown text-ink-soft text-sm">
                Escribe a{" "}
                <a
                  className="text-ink underline decoration-from-font underline-offset-4"
                  href="mailto:hola@apidame.com"
                >
                  hola@apidame.com
                </a>
              </dd>
            </div>
          </dl>
          <p className="font-brown text-ink-soft mt-4 text-xs">
            * Acreditar con carnet o credencial de estudiante.
          </p>
          <Logo height={40} width={43} className="fill-ink mt-10 h-10 w-10" />
        </div>
        <div
          className="border-rule relative min-h-[20rem] w-full border md:min-h-full"
          onMouseLeave={() => setMapLive(false)}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2744.2544530120053!2d-71.71614262295716!3d-46.54265308138484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xbded2b2de962d3c1%3A0x5b288c19fb231bd7!2sApidame%20Boulder!5e0!3m2!1ses!2scl!4v1704127632243!5m2!1ses!2scl"
            width="600"
            height="450"
            className={`h-full min-h-[20rem] w-full border-none md:min-h-[28rem] ${
              mapLive ? "pointer-events-auto" : "pointer-events-none"
            }`}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa del muro de escalada Apidame"
          />
          {mapLive ? null : (
            <button
              type="button"
              className="absolute inset-0 z-10 cursor-pointer"
              aria-label="Activar el mapa"
              onClick={() => setMapLive(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
