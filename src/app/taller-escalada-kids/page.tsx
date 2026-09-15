"use client";

import { CldImage } from "next-cloudinary";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function TallerEscaladaKids() {
  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader current="muro" />
      <article className="page-shell grid gap-10 py-12 md:grid-cols-2 md:gap-16 md:py-16">
        <CldImage
          src="apidame-web/taller_de_escalada_kids_uzwz5q"
          alt="Taller de escalada kids"
          width={800}
          height={900}
          className="w-full object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="flex flex-col gap-6 font-brown text-base leading-relaxed">
          <p className="kicker">Muro</p>
          <h1 className="font-display text-3xl md:text-5xl">
            Taller de escalada kids
          </h1>
          <p className="text-ink-soft">
            Bienvenido al taller de escalada kids, diseñado para introducir a
            tus hijos en la emoción y la diversión de la escalada indoor. En
            Apidame Boulder ofrecemos una experiencia que combina aprendizaje,
            aventura y seguridad.
          </p>

          <div>
            <h2 className="font-display text-2xl">Detalles</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-soft">
              <li>Días: martes y jueves</li>
              <li>Horario: 18:30 a 20:00</li>
              <li>Duración: enero, con posibilidad de extenderse a febrero</li>
              <li>Tarifa mensual: $45.000</li>
            </ul>
          </div>

          <p className="text-ink-soft">
            El taller está supervisado por instructores. No se requieren
            zapatillas de escalada: hay pares para prestar, y también se pueden
            comprar.
          </p>

          <div>
            <h2 className="font-display text-2xl">Por qué sumarse</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-soft">
              <li>Desarrollo de habilidades físicas y mentales</li>
              <li>Construcción de confianza y autoestima</li>
              <li>Un ambiente amigable para partir</li>
            </ul>
          </div>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
