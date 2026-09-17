import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getZoneById } from "@/lib/guide/queries";
import { updateZone, moveSector, orderSectorsNorthToSouth } from "../../actions";

type ZoneAdminProps = {
  params: Promise<{ zoneId: string }>;
};

export default async function ZoneAdminPage({ params }: ZoneAdminProps) {
  const { zoneId } = await params;
  const data = await getZoneById(zoneId);
  if (!data) notFound();
  const { zone, sectors, walls, routes, topos } = data;

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />
      <section className="page-shell py-12">
        <p className="kicker">Dashboard</p>
        <h1 className="font-display mt-2 text-4xl">{zone.name}</h1>
        <form action={updateZone} className="mt-8 flex max-w-xl flex-col gap-4">
          <input type="hidden" name="id" value={zone.id} />
          <label className="font-brown text-sm">
            Nombre
            <input
              name="name"
              defaultValue={zone.name}
              className="border-rule mt-2 block w-full border px-3 py-2"
            />
          </label>
          <label className="font-brown text-sm">
            Descripción
            <textarea
              name="description"
              defaultValue={zone.description ?? ""}
              rows={8}
              className="border-rule mt-2 block w-full border px-3 py-2"
            />
          </label>
          <label className="font-brown flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={zone.published}
            />
            Publicada
          </label>
          <button
            type="submit"
            className="font-brown border-rule w-fit border px-4 py-2 text-sm tracking-[0.16em] uppercase"
          >
            Guardar zona
          </button>
        </form>

        <section className="mt-14">
          <h2 className="font-display text-2xl">Orden del mapa</h2>
          <p className="font-brown text-ink-soft mt-3 max-w-xl text-sm leading-relaxed">
            El número es el pin del mapa y de la leyenda del PDF. Súbelos o
            bájalos, o alinéalos de norte a sur. El PDF se regenera al ordenar
            de norte a sur o al guardar la zona.
          </p>
          {sectors.length > 1 ? (
            <form action={orderSectorsNorthToSouth} className="mt-4">
              <input type="hidden" name="zoneId" value={zone.id} />
              <button
                type="submit"
                className="font-brown border-rule border px-4 py-2 text-xs tracking-[0.16em] uppercase"
              >
                Ordenar de norte a sur
              </button>
            </form>
          ) : null}
          <ol className="mt-6 divide-rule divide-y border-rule border-y">
            {sectors.map((sector, index) => (
              <li
                key={sector.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="border-signal text-signal mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-xl">{sector.name}</p>
                    <p className="font-brown text-ink-soft mt-1 text-xs tracking-[0.08em] uppercase">
                      {sector.latitude != null && sector.longitude != null
                        ? `${sector.latitude.toFixed(5)}, ${sector.longitude.toFixed(5)}`
                        : "Sin coordenadas"}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <form action={moveSector}>
                    <input type="hidden" name="zoneId" value={zone.id} />
                    <input type="hidden" name="sectorId" value={sector.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      disabled={index === 0}
                      className="font-brown border-rule border px-3 py-2 text-xs tracking-[0.14em] uppercase disabled:opacity-30"
                    >
                      Subir
                    </button>
                  </form>
                  <form action={moveSector}>
                    <input type="hidden" name="zoneId" value={zone.id} />
                    <input type="hidden" name="sectorId" value={sector.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={index === sectors.length - 1}
                      className="font-brown border-rule border px-3 py-2 text-xs tracking-[0.14em] uppercase disabled:opacity-30"
                    >
                      Bajar
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {sectors.map((sector) => {
          const sectorWalls = walls.filter((wall) => wall.sectorId === sector.id);
          return (
            <section key={sector.id} className="mt-12">
              <h2 className="font-display text-2xl">{sector.name}</h2>
              <ul className="mt-4 grid gap-3">
                {sectorWalls.map((wall) => {
                  const routeCount = routes.filter((r) => r.wallId === wall.id)
                    .length;
                  const topoCount = topos.filter((t) => t.wallId === wall.id)
                    .length;
                  return (
                    <li key={wall.id} className="border-rule border p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-display text-xl">{wall.name}</p>
                          <p className="font-brown text-ink-soft text-xs">
                            {routeCount} rutas · {topoCount} topos
                          </p>
                        </div>
                        <Link
                          href={`/dashboard/paredes/${wall.id}`}
                          className="font-brown text-xs tracking-[0.14em] uppercase underline decoration-from-font underline-offset-4"
                        >
                          Editar pared
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </section>
      <SiteFooter />
    </main>
  );
}
