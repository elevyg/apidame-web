import Link from "next/link";
import Logo from "assets/svgs/icon-solo.svg";
import FeaturedRoutesGallery from "./FeaturedRoutesGallery";
import featuredRoutes from "./featuredRoutes.json";
import type { FeaturedRoute } from "./types";
import Image from "next/image";
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
    <main className="bg-primaryA flex min-h-screen flex-col overflow-x-hidden">
      <nav className="shrink-0">
        <Link
          className="y2k-nav-anim bg-primaryA flex items-center justify-center gap-4 py-4 md:py-6"
          href="/"
        >
          <Logo
            height={50}
            width={50}
            className="y2k-logo-float fill-primaryB h-[30px] w-[30px] md:h-[50px] md:w-[50px]"
          />
          <h1 className="font-holluise text-primaryB text-xl tracking-[0.4em] md:text-5xl">
            APIDAME BOULDER
          </h1>
        </Link>
      </nav>

      <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 pb-8 md:p-8">
        <div className="y2k-accent-bar shrink-0" />

        <section className="flex flex-col gap-3 px-1">
          <div>
            <h2 className="font-forgen text-primaryB text-3xl md:text-5xl">
              Cerro Apidame
            </h2>
          </div>
        </section>

        <section className="flex w-full max-w-screen flex-col gap-6 px-1">
          <div className="flex flex-col gap-5 md:flex-row md:gap-5">
            <div className="text-primaryB/80 flex flex-col gap-3 text-sm leading-relaxed md:text-lg">
              <p className="font-brown">
                El Cerro Apidame está en el Parque Nacional Patagonia, en uno de
                sus extremos más cercanos a Chile Chico. Es un gran destino para
                amantes de la fisura, con rutas de mono largo y multilargo en
                estilo tradicional.
              </p>
              <p className="font-brown text-primaryB/75">
                Su microclima permite escalar incluso cuando en el resto de la
                región no se puede, haciendo del cerro una parada obligada en tu
                viaje a la Patagonia.
              </p>

              <div className="border-secondaryB/60 bg-secondaryB/10 font-brown text-secondaryB rounded border px-4 py-3 text-xs">
                <p className="text-secondaryB/80 mb-2 text-[11px] tracking-[0.2em] uppercase">
                  Advertencia legal
                </p>
                <p className="text-secondaryB">
                  El plan de manejo permite escalar en el Cerro Apidame, pero
                  debes llenar la ficha oficial y enviarla a{" "}
                  <span className="text-primaryB/80 break-words">
                    benjamin.molina@conaf.cl
                  </span>
                  .
                </p>
                <a
                  href="https://docs.google.com/document/d/16ZBggnYo3Cg7VmkN_L8jqPqSJbxMjvb8/edit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primaryB/80 hover:text-primaryB underline"
                >
                  Ver ficha
                </a>
                <p className="text-secondaryB mt-2">
                  Si ocurre un accidente y no completaste la ficha, tu ingreso
                  se considera ilegal y podrían tomarse acciones legales.
                </p>
              </div>

              <p className="font-brown text-primaryB/70 text-xs">
                Actualmente no existe ni helicóptero ni equipo de rescate en
                Chile Chico, para que lo tengas en consideración.
              </p>
            </div>

            {/* <div className="flex flex-col gap-3">
              <div className="y2k-image-bleed y2k-bleed-edge font-brown text-primaryB/50 flex aspect-[16/9] items-center justify-center text-[10px]">
                /images/topo-page/cerro-apidame-hero.jpg
              </div>
              <div className="y2k-image-bleed y2k-bleed-edge font-brown text-primaryB/50 flex aspect-[16/10] items-center justify-center text-[10px]">
                /images/topo-page/fisuras-detalle.jpg
              </div>
            </div> */}
          </div>

          <div className="grid gap-5 md:grid-cols-[0.6fr_0.4fr]">
            <div className="flex flex-col gap-2">
              <h3 className="font-forgen text-primaryB text-lg">
                Consejo de equipo
              </h3>
              <p className="font-brown text-primaryB/70 text-xs leading-relaxed">
                Dos cuerdas de 60m son imprescindibles. Un rack doble de #2 a #3
                más un juego de stoppers pequeños te permitirá resolver la
                mayoría de las rutas. Uno o dos #4 ayudan en algunos largos, y
                conviene llevar cordín para reemplazar los rapeles.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-forgen text-primaryB text-lg">Acceso</h3>
              <p className="font-brown text-primaryB/70 text-xs leading-relaxed">
                Estamos trabajando en hacer la aproximación más amigable.
                Actualmente puedes contactar a{" "}
                <a
                  href="https://www.instagram.com/rocapampa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondaryA/80 hover:text-secondaryA underline"
                >
                  @rocapampa
                </a>{" "}
                en su Instagram para ingresar. Ofrece acceso público,
                estacionamiento (cobra un costo) y porteo.
              </p>
              {/* <div className="y2k-image-bleed y2k-bleed-edge font-brown text-primaryB/50 flex aspect-[16/7] items-center justify-center text-[10px]">
                /images/topo-page/acceso-rocapampa.jpg
              </div> */}
            </div>
          </div>
        </section>

        <section
          id="topos-interactivos"
          className="y2k-panel y2k-noise focus-visible:ring-secondaryA/70 focus-visible:ring-offset-primaryA [@supports(selector(:target))]:target:border-secondaryB/80 flex flex-col gap-4 px-4 py-5 transition outline-none focus-visible:ring-2 focus-visible:ring-offset-4 md:px-6 [@supports(selector(:target))]:target:shadow-[0_0_24px_rgba(255,89,100,0.35)]"
          tabIndex={-1}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-forgen text-primaryB text-2xl md:text-4xl">
                Topos interactivos
              </h2>
              <p className="font-brown text-primaryB/60 text-xs">
                Aquí nacen las líneas que te quedan grabadas.
              </p>
            </div>
          </div>

          <div className="border-secondaryA/30 bg-primaryA/80 font-brown text-secondaryA/70 rounded border px-3 py-2 text-[11px] tracking-[0.3em] uppercase">
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
                        <Image
                          width={128}
                          height={128}
                          src={card.thumbnail}
                          alt={`Preview ${card.title}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="y2k-frame border-primaryB/20 font-brown text-primaryB/40 flex h-16 w-24 items-center justify-center border border-dashed text-[10px]">
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
                  <span className="font-brown text-secondaryA/70 text-xs">
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
          <div className="border-secondaryA/30 border-b-2 px-4 py-3">
            <h3 className="font-forgen text-primaryB text-xl">
              Rutas destacadas
            </h3>
            <p className="font-brown text-primaryB/60 text-xs">
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
