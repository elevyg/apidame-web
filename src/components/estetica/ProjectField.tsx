import EsteticaBar from "@/components/estetica/EsteticaBar";
import EsteticaHero from "@/components/estetica/EsteticaHero";
import HomePanel from "@/components/estetica/HomePanel";
import NotasHomeSection from "@/components/estetica/NotasHomeSection";
import ProjectCluster from "@/components/estetica/ProjectCluster";

const portrait = { width: 1800, height: 2400 } as const;
const landscape = { width: 2400, height: 1800 } as const;
const clusterShell =
  "flex flex-1 flex-col justify-center px-5 py-8 md:px-16 md:py-10 lg:px-24";

type ProjectFieldProps = {
  lab?: boolean;
};

export default function ProjectField({ lab = false }: ProjectFieldProps) {
  return (
    <>
      <EsteticaBar />
      <HomePanel hero as="div" className="bg-ink">
        <EsteticaHero lab={lab} />
      </HomePanel>
      <HomePanel className="bg-canvas">
        <NotasHomeSection />
      </HomePanel>

      <HomePanel id="muro" className="bg-paper">
        <div className={clusterShell}>
          <ProjectCluster
            name="Muro"
            cta={{
              label: "Horarios y acceso",
              href: lab ? "/#muro-de-escalada" : "#muro-de-escalada",
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
        </div>
      </HomePanel>

      <HomePanel id="cerro" className="bg-paper">
        <div className={clusterShell}>
          <ProjectCluster
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
        </div>
      </HomePanel>

      <HomePanel id="deportiva" className="bg-paper">
        <div className={clusterShell}>
          <ProjectCluster
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
      </HomePanel>
    </>
  );
}
