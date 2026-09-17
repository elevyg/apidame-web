import ComingSoonTopo from "@/components/ComingSoonTopo";
import { pageMetadata } from "../../seo";

export const metadata = {
  ...pageMetadata({
    title: "Pared Norte",
    description:
      "Topo digital de la Pared Norte en el Cerro Apidame, también llamado Cerro Colorado, cerca de Chile Chico. Pronto.",
    path: "/topos/pared-norte",
  }),
  robots: { index: false, follow: true },
};

export default function ParedNorte() {
  return (
    <ComingSoonTopo
      title="Pared Norte"
      description="Estamos preparando el topo digital de la Pared Norte, con zoom y rutas destacadas."
    />
  );
}
