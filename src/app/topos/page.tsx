import Link from "next/link";
import Logo from "assets/svgs/icon-solo.svg";
import TopoClient from "./TopoClient";

export default function Topos() {
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-primaryA">
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

      <div className="flex min-h-0 flex-1 flex-col p-4 md:p-8">
        <div className="y2k-accent-bar mb-4 shrink-0" />

        <TopoClient />

        <div className="y2k-panel mt-4 border-2 border-secondaryB/70 bg-secondaryB/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-secondaryB px-3 py-1 text-xs font-brown text-secondaryB">
              Próximamente
            </span>
            <p className="font-forgen text-lg text-primaryB">
              Topo Interactivo de la Pared Norte y Escudo
            </p>
          </div>
          <p className="mt-2 font-brown text-xs text-primaryB/70">
            Estamos preparando los topos digitales para esos sectores. Muy
            pronto estarán disponibles.
          </p>
        </div>

        <div className="y2k-accent-bar mt-4 shrink-0" />

        <div className="y2k-panel mt-4 flex min-h-[220px] flex-col">
          <div className="border-b-2 border-secondaryA/30 px-4 py-3">
            <h3 className="font-forgen text-xl text-primaryB">Descargar topos</h3>
            <p className="font-brown text-xs text-primaryB/60">
              Archivos originales para imprimir.
            </p>
          </div>
          <div className="relative min-h-0 flex-1 p-(--spacing-panel)">
            <div className="y2k-panel-sunken absolute inset-0 m-(--spacing-panel)">
              <iframe
                src="https://drive.google.com/embeddedfolderview?id=1-Be9uxgPKeD30336yjwvZa8czW9iBwNu#grid"
                className="h-full w-full border-none"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
