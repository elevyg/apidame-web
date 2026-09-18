import ComingSoonTopo from "@/components/ComingSoonTopo";
import { pageMetadata } from "../../seo";

export const metadata = {
  ...pageMetadata({
    title: "Escudo",
    description:
      "Topo digital de Escudo en el Cerro Apidame, también llamado Cerro Colorado, cerca de Chile Chico. Pronto.",
    path: "/topos/escudo",
  }),
  robots: { index: false, follow: true },
};

export default function Escudo() {
  return (
    <ComingSoonTopo
      title="Escudo"
      description="Estamos preparando el topo digital de Escudo, con zoom y las líneas de la pared."
    />
  );
}
