"use client";

import { useEffect, useRef, useState } from "react";
import EsteticaBar from "@/components/estetica/EsteticaBar";
import EsteticaHero from "@/components/estetica/EsteticaHero";
import ProjectCluster from "@/components/estetica/ProjectCluster";

const portrait = { width: 1800, height: 2400 } as const;
const landscape = { width: 2400, height: 1800 } as const;

type ProjectFieldProps = {
  lab?: boolean;
};

export default function ProjectField({ lab = false }: ProjectFieldProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastHero(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <EsteticaBar visible={pastHero} />
      <EsteticaHero ref={heroRef} lab={lab} />

      <section className="px-5 pt-8 pb-24 md:px-16 md:pt-16 md:pb-40 lg:px-24">
        <div className="flex flex-col gap-24 md:gap-36 lg:gap-44">
          <ProjectCluster
            id="muro"
            name="Muro"
            cta={{
              label: "Horarios y acceso",
              href: lab ? "/#gimnasio" : "#gimnasio",
            }}
            layout="photo-end"
            priority
            primary={{
              src: "/estetica/muro/sesion-habitada.jpg",
              alt: "Sesión en el muro",
              ...portrait,
            }}
            thumbs={[
              {
                src: "/estetica/muro/galpon-nieve-b.jpg",
                alt: "El galpón del muro en Chile Chico",
                ...portrait,
              },
              {
                src: "/estetica/muro/setting-techo.jpg",
                alt: "Setting en el techo del muro",
                ...portrait,
              },
            ]}
          />

          <ProjectCluster
            id="cerro"
            name="Cerro Apidame"
            kicker="Parque Nacional Patagonia"
            cta={{ label: "Ver topos", href: "/topos" }}
            layout="banner"
            primary={{
              src: "/estetica/guia.jpg",
              alt: "Cerro Apidame",
              width: 4032,
              height: 3024,
            }}
          />

          <ProjectCluster
            id="deportiva"
            name="Escalada deportiva"
            kicker="El Indio · Pared Burgos"
            cta={{ label: "Pronto" }}
            layout="photo-start"
            primary={{
              src: "/estetica/deportiva/lago.jpg",
              alt: "Escalador en la pared, con el lago al fondo",
              ...portrait,
            }}
            thumbs={[
              {
                src: "/estetica/deportiva/pared-bici.jpg",
                alt: "Pared con cordadas y una bici en la base",
                ...landscape,
              },
              {
                src: "/estetica/deportiva/farallon.jpg",
                alt: "El farallón del sector al atardecer",
                ...landscape,
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}
