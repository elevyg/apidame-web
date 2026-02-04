import Link from "next/link";
import Logo from "assets/svgs/icon-solo.svg";
import FeaturedRoutesGallery from "./FeaturedRoutesGallery";
import featuredRoutes from "./featuredRoutes.json";
import type { FeaturedRoute } from "./types";
const cards = [
  {
    title: "Topo Interactivo Proa y Repisa Central",
    href: "/topos/proa-repisa",
    thumbnail: "/topos/proa-repisa-thumb.jpg",
    description:
      "Explora la pared con zoom y detalles. Ideal para planificar tu sesión.",
    enabled: true,
    featured: true,
  },
];

export default function Topos() {
  const routes = featuredRoutes as FeaturedRoute[];

  return (
    <main className="flex min-h-screen flex-col bg-primaryA">
      <nav className="shrink-0">
        <Link
          className="y2k-nav-anim flex items-center justify-center gap-4 bg-primaryA py-4 md:py-6"
          href="/"
        >
          <Logo
            height={50}
            width={50}
            className="y2k-logo-float h-[30px] w-[30px] fill-primaryB md:h-[50px] md:w-[50px]"
          />
          <h1 className="font-holluise text-xl tracking-[0.4em] text-primaryB md:text-5xl">
            APIDAME BOULDER
          </h1>
        </Link>
      </nav>

      <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 pb-8 md:p-8">
        <div className="y2k-accent-bar shrink-0" />

        <section className="flex flex-col gap-3 px-1">
          <div>
            <h2 className="font-forgen text-3xl text-primaryB md:text-5xl">
              Cerro Apidame
            </h2>
            <p className="font-brown text-xs text-primaryB/60">
              Un anfiteatro de líneas, textura y viento.
            </p>
          </div>
        </section>

        <section
          id="topos-interactivos"
          className="y2k-panel y2k-noise flex flex-col gap-4 px-4 py-5 md:px-6 transition outline-none focus-visible:ring-2 focus-visible:ring-secondaryA/70 focus-visible:ring-offset-4 focus-visible:ring-offset-primaryA [@supports(selector(:target))]:target:border-secondaryB/80 [@supports(selector(:target))]:target:shadow-[0_0_24px_rgba(255,89,100,0.35)]"
          tabIndex={-1}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-forgen text-2xl text-primaryB md:text-4xl">
                Topos interactivos
              </h2>
              <p className="font-brown text-xs text-primaryB/60">
                Aquí nacen las líneas que te quedan grabadas.
              </p>
            </div>
          </div>

          <div className="rounded border border-secondaryA/30 bg-primaryA/80 px-3 py-2 text-[11px] font-brown uppercase tracking-[0.3em] text-secondaryA/70">
            Muy pronto habrá más topos interactivos.
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {cards.map((card) => {
              const content = (
                <div
                  className={`y2k-panel y2k-noise flex h-full flex-col gap-3 border px-3 py-3 ${card.enabled ? "" : "y2k-card-disabled"}`}
                >
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
