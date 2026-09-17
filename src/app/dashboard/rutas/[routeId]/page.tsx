import { notFound } from "next/navigation";
import Link from "next/link";
import { getRouteEditor } from "@/lib/guide/queries";
import { updateRoute } from "../../actions";
import RouteLineForm from "../RouteLineForm";

type RouteAdminProps = {
  params: Promise<{ routeId: string }>;
};

export default async function RouteAdminPage({ params }: RouteAdminProps) {
  const { routeId } = await params;
  const data = await getRouteEditor(routeId);
  if (!data) notFound();
  const { route, wall, sector, zone, topos, paths } = data;
  const mainTopo = topos.find((topo) => topo.main);
  const hasMainLine = mainTopo
    ? paths.some((path) => path.topoId === mainTopo.id)
    : false;

  return (
    <section className="page-shell py-12">
      <p className="kicker">
        <Link href={`/dashboard/zonas/${zone.id}`}>{zone.name}</Link>
        {" · "}
        <Link href={`/dashboard/paredes/${wall.id}`}>{wall.name}</Link>
        {" · "}
        {sector.name}
      </p>
      <h1 className="font-display mt-2 text-4xl">{route.name}</h1>
      <p className="font-brown text-ink-soft mt-3 text-sm">
        {hasMainLine
          ? "Tiene línea en el topo principal."
          : topos.length === 0
            ? "Falta el topo de la pared."
            : "Sin línea en el topo principal."}
      </p>

      <form action={updateRoute} className="mt-8 grid max-w-xl gap-3">
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
          Orden en la pared
          <input
            name="position"
            type="number"
            defaultValue={route.position}
            className="border-rule mt-1 block w-full border px-3 py-2"
          />
        </label>
        <label className="font-brown text-sm">
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

      <h2 className="font-display mt-14 text-2xl">Línea</h2>
      <p className="font-brown text-ink-soft mt-2 max-w-xl text-sm leading-relaxed">
        La línea es esta ruta en un topo. Elige la foto y dibuja.
      </p>
      <div className="mt-6">
        <RouteLineForm routeId={route.id} topos={topos} paths={paths} />
      </div>
    </section>
  );
}
