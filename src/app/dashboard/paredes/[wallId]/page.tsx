import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { withFrenchGrade } from "@/lib/climbing/frenchGrade";
import { getWallById } from "@/lib/guide/queries";
import { db } from "@/db/client";
import { routes, topos } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { createRoute, updateRoute } from "../../actions";

type WallAdminProps = {
  params: Promise<{ wallId: string }>;
};

export default async function WallAdminPage({ params }: WallAdminProps) {
  const { wallId } = await params;
  const context = await getWallById(wallId);
  if (!context) notFound();
  const { wall, sector, zone } = context;
  const wallRoutes = await db
    .select()
    .from(routes)
    .where(eq(routes.wallId, wall.id))
    .orderBy(asc(routes.position));
  const wallTopos = await db
    .select()
    .from(topos)
    .where(eq(topos.wallId, wall.id))
    .orderBy(asc(topos.position));

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />
      <section className="page-shell py-12">
        <p className="kicker">
          {zone.name} · {sector.name}
        </p>
        <h1 className="font-display mt-2 text-4xl">{wall.name}</h1>
        <Link
          href={`/dashboard/zonas/${zone.id}`}
          className="font-brown text-ink-soft mt-3 inline-block text-xs tracking-[0.14em] uppercase"
        >
          Volver a la zona
        </Link>

        <h2 className="font-display mt-10 text-2xl">Topos</h2>
        <ul className="mt-4 grid gap-3">
          {wallTopos.map((topo) => (
            <li key={topo.id} className="border-rule flex items-center justify-between border p-4">
              <p className="font-brown text-sm">
                {topo.name ?? "Topo"} {topo.main ? "· principal" : ""}
              </p>
              <Link
                href={`/dashboard/topos/${topo.id}`}
                className="font-brown text-xs tracking-[0.14em] uppercase underline decoration-from-font underline-offset-4"
              >
                Dibujar líneas
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="font-display mt-10 text-2xl">Rutas</h2>
        <ul className="mt-4 grid gap-6">
          {wallRoutes.map(withFrenchGrade).map((route) => (
            <li key={route.id} className="border-rule border p-4">
              <form action={updateRoute} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={route.id} />
                <label className="font-brown text-sm">
                  Nombre
                  <input
                    name="name"
                    defaultValue={route.name}
                    className="border-rule mt-1 block w-full border px-3 py-2"
                  />
                </label>
                <label className="font-brown text-sm">
                  Grado
                  <input
                    name="grade"
                    defaultValue={route.grade ?? ""}
                    className="border-rule mt-1 block w-full border px-3 py-2"
                  />
                </label>
                <label className="font-brown text-sm">
                  Tipo
                  <input
                    name="kind"
                    defaultValue={route.kind}
                    className="border-rule mt-1 block w-full border px-3 py-2"
                  />
                </label>
                <label className="font-brown text-sm">
                  Posición
                  <input
                    name="position"
                    type="number"
                    defaultValue={route.position}
                    className="border-rule mt-1 block w-full border px-3 py-2"
                  />
                </label>
                <label className="font-brown text-sm md:col-span-2">
                  Descripción
                  <textarea
                    name="description"
                    defaultValue={route.description ?? ""}
                    rows={3}
                    className="border-rule mt-1 block w-full border px-3 py-2"
                  />
                </label>
                <button
                  type="submit"
                  className="font-brown border-rule w-fit border px-4 py-2 text-xs tracking-[0.16em] uppercase"
                >
                  Guardar ruta
                </button>
              </form>
            </li>
          ))}
        </ul>

        <form action={createRoute} className="border-rule mt-10 grid max-w-xl gap-3 border p-4">
          <h2 className="font-display text-2xl">Agregar ruta</h2>
          <input type="hidden" name="wallId" value={wall.id} />
          <label className="font-brown text-sm">
            Nombre
            <input name="name" className="border-rule mt-1 block w-full border px-3 py-2" />
          </label>
          <label className="font-brown text-sm">
            Grado
            <input name="grade" className="border-rule mt-1 block w-full border px-3 py-2" />
          </label>
          <label className="font-brown text-sm">
            Posición
            <input
              name="position"
              type="number"
              defaultValue={wallRoutes.length + 1}
              className="border-rule mt-1 block w-full border px-3 py-2"
            />
          </label>
          <button
            type="submit"
            className="font-brown border-rule w-fit border px-4 py-2 text-xs tracking-[0.16em] uppercase"
          >
            Crear
          </button>
        </form>
      </section>
      <SiteFooter />
    </main>
  );
}
