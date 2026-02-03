import Link from "next/link";
import Logo from "assets/svgs/icon-solo.svg";
const cards = [
  {
    title: "Topo Interactivo Proa y Repisa Central",
    href: "/topos/proa-repisa",
    status: "Activo",
    thumbnail: "/topos/proa-repisa-thumb.jpg",
    description:
      "Explora la pared con zoom y detalles. Ideal para planificar tu sesión.",
    enabled: true,
  },
  {
    title: "Topo Interactivo de la Pared Norte",
    status: "Próximamente",
    description: "Estamos preparando el topo digital para este sector.",
    enabled: false,
  },
  {
    title: "Topo Interactivo de Escudo",
    status: "Próximamente",
    description: "En camino: nueva vista interactiva para el sector Escudo.",
    enabled: false,
  },
];

const statusStyles: Record<string, string> = {
  Activo: "border-secondaryA text-secondaryA y2k-glow",
  "Próximamente": "border-primaryB/40 text-primaryB/70",
};

export default function Topos() {
  return (
    <main className="flex min-h-screen flex-col bg-primaryA">
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

      <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 pb-8 md:p-8">
        <div className="y2k-accent-bar shrink-0" />

        <section className="y2k-panel flex flex-col gap-6 px-4 py-5 md:px-6">
          <div>
            <h2 className="font-forgen text-2xl text-primaryB md:text-3xl">
              Topos interactivos
            </h2>
            <p className="font-brown text-xs text-primaryB/60">
              Selecciona una pared para explorar sus rutas.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => {
              const badgeStyle =
                statusStyles[card.status] ?? "border-primaryB/40 text-primaryB";
              const content = (
                <div
                  className={`y2k-panel y2k-noise flex h-full flex-col gap-3 border ${card.enabled ? "px-4 py-4" : "px-3 py-3"} ${card.enabled ? "" : "y2k-card-disabled"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-brown uppercase tracking-[0.2em] ${badgeStyle}`}
                    >
                      {card.status}
                    </span>
                    <div className="flex gap-1">
                      <span
                        className={`h-2 w-2 rounded-full ${card.enabled ? "bg-secondaryA/70" : "bg-primaryB/30"}`}
                      />
                      <span
                        className={`h-2 w-2 rounded-full ${card.enabled ? "bg-secondaryB/70" : "bg-primaryB/30"}`}
                      />
                    </div>
                  </div>
                  {card.thumbnail ? (
                    <div className="y2k-frame h-32 overflow-hidden">
                      <img
                        src={card.thumbnail}
                        alt={`Preview ${card.title}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="y2k-frame flex h-20 items-center justify-center border border-dashed border-primaryB/20 text-[11px] font-brown text-primaryB/40">
                      Preview pronto
                    </div>
                  )}
                  <h3
                    className={`font-forgen text-primaryB ${card.enabled ? "text-lg" : "text-base"}`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`font-brown text-primaryB/60 ${card.enabled ? "text-xs" : "text-[11px]"}`}
                  >
                    {card.description}
                  </p>
                  <span className="mt-auto text-xs font-brown text-secondaryA/70">
                    {card.enabled ? "Abrir topo" : "Disponible pronto"}
                  </span>
                </div>
              );

              return card.enabled ? (
                <Link key={card.title} href={card.href ?? "/topos"}>
                  {content}
                </Link>
              ) : (
                <div key={card.title} className="cursor-not-allowed">
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        <section className="y2k-panel y2k-noise flex min-h-[360px] flex-col">
          <div className="border-b-2 border-secondaryA/30 px-4 py-3">
            <h3 className="font-forgen text-xl text-primaryB">
              Rutas destacadas
            </h3>
            <p className="font-brown text-xs text-primaryB/60">
              Selección curada y material para revisar en detalle.
            </p>
          </div>
          <div className="relative min-h-[240px] flex-1 p-(--spacing-panel) md:min-h-0">
            <div className="y2k-frame y2k-panel-sunken h-full w-full md:absolute md:inset-0 md:m-(--spacing-panel)">
              <div className="pointer-events-none absolute right-4 top-4 flex gap-1">
                <span className="h-2 w-2 rounded-full bg-secondaryA/70" />
                <span className="h-2 w-2 rounded-full bg-secondaryB/70" />
                <span className="h-2 w-2 rounded-full bg-primaryB/60" />
              </div>
              <iframe
                src="https://drive.google.com/embeddedfolderview?id=1-Be9uxgPKeD30336yjwvZa8czW9iBwNu#grid"
                className="h-full w-full border-none"
              />
            </div>
          </div>
        </section>

        <div className="y2k-accent-bar shrink-0" />
      </div>
    </main>
  );
}
