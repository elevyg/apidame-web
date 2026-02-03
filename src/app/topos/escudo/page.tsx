import Link from "next/link";
import Logo from "assets/svgs/icon-solo.svg";

export default function Escudo() {
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-primaryA">
      <nav className="shrink-0">
        <Link
          className="flex items-center justify-center gap-4 bg-primaryA py-4 md:py-6"
          href="/topos"
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

      <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 md:p-8">
        <div className="y2k-accent-bar shrink-0" />

        <section className="y2k-panel y2k-noise flex min-h-[260px] flex-col px-5 py-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-forgen text-2xl text-primaryB md:text-3xl">
              Topo Interactivo de Escudo
            </h2>
            <span className="rounded-full border border-primaryB/40 px-3 py-1 text-xs font-brown text-primaryB/70">
              Próximamente
            </span>
          </div>
          <p className="mt-3 font-brown text-xs text-primaryB/70">
            Muy pronto podrás explorar Escudo con zoom y detalles.
          </p>
          <div className="mt-6 flex flex-1 items-center justify-center">
            <div className="rounded border border-primaryB/20 px-4 py-2 text-xs font-brown text-primaryB/50">
              Avance en camino
            </div>
          </div>
        </section>

        <div className="y2k-accent-bar shrink-0" />
      </div>
    </main>
  );
}
