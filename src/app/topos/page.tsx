import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FeaturedRoutesGallery from "./FeaturedRoutesGallery";
import featuredRoutes from "./featuredRoutes.json";
import type { FeaturedRoute } from "./types";
import Notice from "@/components/Notice";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Topos",
  description:
    "Topos del Cerro Apidame en el Parque Nacional Patagonia. Proa y Repisa Central, equipo y acceso desde Chile Chico.",
};

export default function Topos() {
  const routes = featuredRoutes as FeaturedRoute[];

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader current="topos" />

      <article>
        <header className="page-shell border-b border-rule py-12 md:py-16">
          <p className="kicker">Parque Nacional Patagonia · Chile Chico</p>
          <h1 className="font-display mt-4 text-4xl md:text-6xl">
            Cerro Apidame
          </h1>
          <p className="measure mt-6 font-brown text-base leading-relaxed text-ink-soft md:text-lg">
            Destino de fisura en uno de los extremos del parque más cercanos a
            Chile Chico. Rutas de un largo y multilargos en estilo tradicional,
            con un microclima que permite escalar cuando el resto de la región
            no da.
          </p>
        </header>

        <div className="border-b border-rule">
          <Image
            src="/estetica/presentacion/proa-aerea.jpg"
            alt="Cerro Apidame, Proa"
            width={2400}
            height={1600}
            className="h-[42vh] min-h-[16rem] w-full object-cover object-[50%_42%] md:h-[56vh]"
            priority
          />
        </div>

        <section className="page-shell grid gap-12 border-b border-rule py-12 md:grid-cols-[1.2fr_0.8fr] md:gap-16 md:py-16">
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-display text-2xl md:text-3xl">Equipo</h2>
              <p className="mt-4 font-brown text-sm leading-relaxed text-ink-soft md:text-base">
                Dos cuerdas de 60m son imprescindibles. Un rack doble de #2 a #3
                más un juego de stoppers pequeños resuelve la mayoría de las
                rutas. Uno o dos #4 ayudan en algunos largos, y conviene llevar
                cordín para reemplazar los rapeles.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl">Acceso</h2>
              <p className="mt-4 font-brown text-sm leading-relaxed text-ink-soft md:text-base">
                Estamos trabajando en hacer la aproximación más amigable. Hoy
                puedes contactar a{" "}
                <a
                  href="https://www.instagram.com/rocapampa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline decoration-from-font underline-offset-4"
                >
                  @rocapampa
                </a>{" "}
                para ingresar. Ofrece acceso público, estacionamiento (con
                cobro) y porteo.
              </p>
            </div>
            <p className="font-brown text-sm text-ink-soft">
              En Chile Chico no hay helicóptero ni equipo de rescate.
            </p>
          </div>

          <Notice kicker="Advertencia legal">
            <p>
              El plan de manejo permite escalar en el Cerro Apidame, pero debes
              llenar la ficha oficial y enviarla a{" "}
              <span className="break-words">benjamin.molina@conaf.cl</span>.
            </p>
            <p className="mt-3">
              <a
                href="https://docs.google.com/document/d/16ZBggnYo3Cg7VmkN_L8jqPqSJbxMjvb8/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-from-font underline-offset-4"
              >
                Ver ficha CONAF
              </a>
            </p>
            <p className="mt-3">
              Si ocurre un accidente y no completaste la ficha, el ingreso se
              considera ilegal y podrían tomarse acciones legales.
            </p>
          </Notice>
        </section>

        <section
          id="topos-interactivos"
          className="page-shell border-b border-rule py-12 md:py-16"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="kicker">Interactivo</p>
              <h2 className="font-display mt-2 text-3xl md:text-4xl">
                Topos
              </h2>
            </div>
            <p className="font-brown text-sm text-ink-soft">
              Escudo y Pared Norte vienen después.
            </p>
          </div>

          <Link href="/topos/proa-repisa" className="group mt-10 block max-w-xl">
            <p className="kicker">Disponible</p>
            <h3 className="font-display mt-2 text-2xl md:text-3xl">
              Proa y Repisa Central
            </h3>
            <p className="mt-3 font-brown text-sm leading-relaxed text-ink-soft">
              Explora la pared con zoom y detalle. Ideal para planificar la
              sesión.
            </p>
            <span className="mt-4 inline-block font-brown text-sm tracking-[0.14em] uppercase underline decoration-from-font underline-offset-4">
              Abrir topo
            </span>
          </Link>
        </section>

        <section id="rutas-destacadas" className="py-12 md:py-16">
          <div className="page-shell">
            <p className="kicker">Selección</p>
            <h2 className="font-display mt-2 text-3xl md:text-4xl">
              Rutas destacadas
            </h2>
            <p className="mt-3 font-brown text-sm text-ink-soft">
              Topos en PDF para revisar línea por línea.
            </p>
          </div>
          <div className="mt-8">
            <FeaturedRoutesGallery routes={routes} />
          </div>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
