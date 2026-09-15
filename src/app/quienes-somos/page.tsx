import type { Metadata } from "next";
import ArchivoFotos from "@/components/estetica/ArchivoFotos";
import ProjectCluster from "@/components/estetica/ProjectCluster";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Cami y Eyal. El sello Apidame en Chile Chico: muro, Cerro Apidame y deportiva.",
  alternates: { canonical: "/quienes-somos" },
};

const portrait = { width: 1800, height: 2400 } as const;

export default function QuienesSomosPage() {
  return (
    <main className="flex min-h-screen flex-col bg-paper text-ink">
      <SiteHeader current="quienes-somos" />
      <article>
        <section className="px-5 pt-8 pb-24 md:px-16 md:pt-16 md:pb-40 lg:px-24">
          <div className="flex flex-col gap-24 md:gap-36 lg:gap-44">
            <ProjectCluster
              heading="h1"
              name="Quiénes somos"
              kicker="Chile Chico · desde 2021"
              layout="photo-end"
              thumbDock="foot"
              priority
              body={`Somos Cami y Eyal. Dos escaladores que descubrimos la escalada y las montañas en la universidad. El 2021 nos mudamos a Chile Chico enamorados de sus montañas, paredes, su microclima y sus lechugas.

Con el tiempo desarrollamos un cariño especial por el Cerro Apidame, convirtiéndolo en nuestro segundo hogar. Nos encanta crear cosas en torno a la escalada, ya sea construyendo y renovando el muro, abriendo rutas nuevas, explorando rincones del Parque Patagonia o diseñando guías de escalada.

Nuestra pasión por la escalada nace de poder expresar nuestra curiosidad y conectar con el entorno.`}
              primary={{
                src: "/estetica/quienes-somos/eyal-cami-1.jpg",
                alt: "Cami y Eyal en Chile Chico",
                width: 2400,
                height: 1600,
              }}
              thumbs={[
                {
                  src: "/estetica/quienes-somos/cami-eyal-apidame.jpg",
                  alt: "Cami y Eyal en el Cerro Apidame",
                  width: 960,
                  height: 1280,
                },
                {
                  src: "/estetica/quienes-somos/bivac-repisa-flop.jpg",
                  alt: "Cami y Eyal en un vivac del cerro",
                  ...portrait,
                },
              ]}
            />

            <ProjectCluster
              layout="photo-start"
              thumbDock="foot"
              primary={{
                src: "/estetica/quienes-somos/reunion-lago.jpg",
                alt: "Eyal en reunión, con el lago al fondo",
                ...portrait,
              }}
              thumbs={[
                {
                  src: "/estetica/quienes-somos/cami-equipando.jpg",
                  alt: "Cami equipando el muro",
                  ...portrait,
                },
                {
                  src: "/estetica/quienes-somos/eyal-escalando.jpg",
                  alt: "Eyal escalando",
                  width: 2400,
                  height: 1820,
                },
              ]}
            />
          </div>
        </section>
        <ArchivoFotos />
      </article>
      <SiteFooter />
    </main>
  );
}
