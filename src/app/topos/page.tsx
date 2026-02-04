import Link from "next/link";
import Logo from "assets/svgs/icon-solo.svg";
import FeaturedRoutesGallery from "./FeaturedRoutesGallery";
import featuredRoutes from "./featuredRoutes.json";
import type { FeaturedRoute } from "./types";
const cards = [
  {
    title: "Topo Interactivo Proa y Repisa Central",
    href: "/topos/proa-repisa",
    status: "Activo",
    thumbnail: "/topos/proa-repisa-thumb.jpg",
    description:
      "Explora la pared con zoom y detalles. Ideal para planificar tu sesión.",
    enabled: true,
    featured: true,
  },
  {
    title: "Topo Interactivo de la Pared Norte",
    status: "Próximamente",
    description: "Estamos preparando el topo digital para este sector.",
    enabled: false,
    featured: false,
  },
  {
    title: "Topo Interactivo de Escudo",
    status: "Próximamente",
    description: "En camino: nueva vista interactiva para el sector Escudo.",
    enabled: false,
    featured: false,
  },
];

const statusStyles: Record<string, string> = {
  Activo: "border-secondaryA text-secondaryA y2k-glow",
  "Próximamente": "border-primaryB/40 text-primaryB/70",
};

export default function Topos() {
  const routes = featuredRoutes as FeaturedRoute[];

  return (
    <main className="flex min-h-screen flex-col bg-primaryA">
      <nav className="shrink-0">
        <Link
          className="flex items-center justify-center gap-4 bg-primaryA py-4 md:py-6"
          href="/"
        >
          <Logo
            height={50}
            width={50}
            className="h-[30px] w-[30px] fill-primaryB md:h-[50px] md:w-[50px]"
          />
          <h1 className="font-holluise text-xl tracking-[0.4em] text-primaryB md:text-5xl">
            APIDAME BOULDER
          </h1>
        </Link>
      </nav>

      <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 pb-8 md:p-8">
        <div className="y2k-accent-bar shrink-0" />

        <section className="y2k-panel y2k-noise flex flex-col gap-4 px-4 py-5 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-forgen text-2xl text-primaryB md:text-4xl">
                Topos Cerro Apidame
              </h2>
              <p className="font-brown text-xs text-primaryB/60">
                Explora la pared, planea tus sesiones y descubre rutas clave.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/topos/proa-repisa"
                className="rounded border border-secondaryA/70 bg-secondaryA/10 px-4 py-2 text-xs font-brown uppercase tracking-[0.2em] text-secondaryA transition hover:border-secondaryB hover:text-secondaryB"
              >
                Explorar Proa
              </Link>
              <a
                href="#rutas-destacadas"
                className="rounded border border-primaryB/40 px-4 py-2 text-xs font-brown uppercase tracking-[0.2em] text-primaryB/70 transition hover:border-secondaryA hover:text-secondaryA"
              >
                Rutas destacadas
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded border border-secondaryA/30 bg-primaryA/80 px-3 py-2 text-[10px] font-brown uppercase tracking-[0.3em] text-secondaryA/70">
            <span>STATUS: LISTO PARA ESCALAR</span>
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-secondaryA/70" />
              <span className="h-2 w-2 rounded-full bg-secondaryB/70" />
              <span className="h-2 w-2 rounded-full bg-primaryB/60" />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {cards.map((card) => {
              const badgeStyle =
                statusStyles[card.status] ?? "border-primaryB/40 text-primaryB";
              const content = (
                <div
                  className={`y2k-panel y2k-noise flex h-full flex-col gap-3 border px-3 py-3 ${card.enabled ? "" : "y2k-card-disabled"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-brown uppercase tracking-[0.2em] ${badgeStyle}`}
                    >
                      {card.status}
                    </span>
                    <div className="flex gap-1">
                      <span
                        className={`h-2 w-2 rounded-full ${card.enabled ? "bg-secondaryA/70" : "bg-primaryB/30"}`}
                      />
                      <span
                        className={`h-2 w-2 rounded-full ${card.enabled ? "bg-secondaryB/70" : "bg-primaryB/30"}`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {card.thumbnail ? (
                      <div
                        className={`y2k-frame overflow-hidden ${card.featured ? "h-20 w-32" : "h-16 w-24"}`}
                      >
                        <img
                          src={card.thumbnail}
                          alt={`Preview ${card.title}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="y2k-frame flex h-16 w-24 items-center justify-center border border-dashed border-primaryB/20 text-[10px] font-brown text-primaryB/40">
                        Preview
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-1">
                      <h3
                        className={`font-forgen text-primaryB ${card.enabled ? "text-base" : "text-[15px]"}`}
                      >
                        {card.title}
                      </h3>
                      <p
                        className={`font-brown text-primaryB/60 ${card.enabled ? "text-[11px]" : "text-[10px]"}`}
                      >
                        {card.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-brown text-secondaryA/70">
                    {card.enabled ? "Abrir topo →" : "Disponible pronto"}
                  </span>
                </div>
              );

              return card.enabled ? (
                <Link
                  key={card.title}
                  href={card.href ?? "/topos"}
                  className={card.featured ? "md:col-span-2" : ""}
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={card.title}
                  className={`cursor-not-allowed ${card.featured ? "md:col-span-2" : ""}`}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        <section
          id="rutas-destacadas"
          className="y2k-panel y2k-noise flex min-h-[260px] flex-col"
        >
          <div className="border-b-2 border-secondaryA/30 px-4 py-3">
            <h3 className="font-forgen text-xl text-primaryB">
              Rutas destacadas
            </h3>
            <p className="font-brown text-xs text-primaryB/60">
              Selección curada y material para revisar en detalle.
            </p>
          </div>
          <div className="relative min-h-[220px] flex-1 px-4 py-4">
            <FeaturedRoutesGallery routes={routes} />
          </div>
        </section>

        <div className="y2k-accent-bar shrink-0" />
      </div>
    </main>
  );
}
