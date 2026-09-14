"use client";

import Logo from "assets/svgs/icon-solo.svg";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const prices = [
  { label: "Diario", value: "$6.000" },
  { label: "Estudiantes y menores de 18 años*", value: "$4.000" },
  { label: "3 días", value: "$15.000" },
  { label: "1 semana", value: "$20.000" },
];

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "Apidame Boulder",
    image: "https://apidameboulder.com/opengraph-image",
    description:
      "Gimnasio de escalada y boulder en Chile Chico, Aysén. Horarios, precios y topos del Cerro Apidame.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chile Chico",
      addressRegion: "Aysén",
      addressCountry: "CL",
    },
    url: "https://apidameboulder.com",
    sameAs: ["https://www.instagram.com/apidameboulder/"],
  };

  return (
    <main className="flex flex-col">
      <SiteHeader />
      <section className="relative h-[70vh] min-h-[28rem] w-full overflow-hidden bg-paper md:h-[88vh]">
        <Image
          src="/topos/proa-repisa-thumb.jpg"
          alt="Pared de Proa y Repisa Central en el Cerro Apidame"
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </section>

      <section className="page-shell grid gap-10 border-b border-rule py-12 md:grid-cols-[1.2fr_0.8fr] md:items-end md:py-16">
        <div>
          <p className="kicker">Parque Nacional Patagonia</p>
          <h1 className="font-display mt-3 text-4xl md:text-6xl">
            Cerro Apidame
          </h1>
          <p className="measure mt-5 font-brown text-base leading-relaxed text-ink-soft md:text-lg">
            Guía de escalada en Chile Chico: topos del cerro y un centro de
            boulder al borde del pueblo.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <Link
            href="/topos"
            className="font-brown text-sm tracking-[0.16em] uppercase underline decoration-from-font underline-offset-4"
          >
            Ver topos
          </Link>
          <Link
            href="#gimnasio"
            className="font-brown text-sm text-ink-soft tracking-[0.16em] uppercase hover:text-ink"
          >
            Gimnasio
          </Link>
        </div>
      </section>

      <section
        id="gimnasio"
        className="page-shell grid gap-12 border-b border-rule py-14 md:grid-cols-2 md:gap-16 md:py-20"
      >
        <div>
          <p className="kicker">Chile Chico</p>
          <h2 className="font-display mt-3 text-3xl md:text-5xl">Gimnasio</h2>
          <p className="mt-5 font-brown text-base leading-relaxed text-ink-soft">
            El centro está en el Camino Internacional, a 200 metros del límite
            urbano de Chile Chico. Este es el letrero que da a la calle:
          </p>
          <CldImage
            src="apidame-web/apidame_street_sign_pnneko"
            alt="Letrero de Apidame Boulder en el Camino Internacional"
            width={640}
            height={640}
            className="mt-8 aspect-square w-full max-w-sm object-cover"
            sizes="(max-width: 768px) 100vw, 24rem"
          />
        </div>
        <div className="min-h-[20rem] w-full border border-rule md:min-h-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2744.2544530120053!2d-71.71614262295716!3d-46.54265308138484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xbded2b2de962d3c1%3A0x5b288c19fb231bd7!2sApidame%20Boulder!5e0!3m2!1ses!2scl!4v1704127632243!5m2!1ses!2scl"
            width="600"
            height="450"
            className="h-full min-h-[20rem] w-full border-none md:min-h-[28rem]"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de Apidame Boulder"
          />
        </div>
      </section>

      <section
        id="horarios"
        className="page-shell grid gap-12 py-14 md:grid-cols-2 md:gap-16 md:py-20"
      >
        <div>
          <h2 className="font-display text-3xl md:text-5xl">Horarios</h2>
          <p className="mt-5 font-brown text-base leading-relaxed">
            Contáctanos por Instagram para agendar tu sesión de escalada:{" "}
            <a
              className="underline decoration-from-font underline-offset-4"
              href="https://www.instagram.com/apidameboulder/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @apidameboulder
            </a>
          </p>
          <Logo height={40} width={43} className="mt-10 h-10 w-10 fill-ink" />
        </div>
        <div>
          <h2 className="font-display text-3xl md:text-5xl">Precios</h2>
          <dl className="mt-8 divide-y divide-rule border-y border-rule">
            {prices.map((item) => (
              <div
                key={item.label}
                className="flex items-baseline justify-between gap-6 py-4"
              >
                <dt className="font-brown text-sm md:text-base">{item.label}</dt>
                <dd className="font-brown text-sm md:text-base">{item.value}</dd>
              </div>
            ))}
            <div className="flex flex-col gap-2 py-4">
              <dt className="font-brown text-sm md:text-base">Membresía</dt>
              <dd className="font-brown text-sm text-ink-soft">
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
          <p className="mt-4 font-brown text-xs text-ink-soft">
            * Acreditar con carnet o credencial de estudiante.
          </p>
        </div>
      </section>

      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
