import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getZoneById } from "@/lib/guide/queries";
import { updateZone } from "../../actions";

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
