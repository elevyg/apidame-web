import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getTopoEditor } from "@/lib/guide/queries";
import DrawForm from "../DrawForm";
import { updateTopoMeta } from "../../actions";

type TopoAdminProps = {
  params: Promise<{ topoId: string }>;
};

export default async function TopoAdminPage({ params }: TopoAdminProps) {
  const { topoId } = await params;
  const data = await getTopoEditor(topoId);
  if (!data) notFound();
  const { topo, wall, zone, routes, paths } = data;

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />
      <section className="page-shell py-12">
        <p className="kicker">
          {zone.name} · {wall.name}
        </p>
        <h1 className="font-display mt-2 text-4xl">
          {topo.name ?? "Topo"}
        </h1>
        <Link
          href={`/dashboard/paredes/${wall.id}`}
          className="font-brown text-ink-soft mt-3 inline-block text-xs tracking-[0.14em] uppercase"
        >
          Volver a la pared
        </Link>
        <form action={updateTopoMeta} className="mt-8 flex max-w-xl flex-col gap-3">
          <input type="hidden" name="id" value={topo.id} />
          <label className="font-brown text-sm">
            Nombre
            <input
              name="name"
              defaultValue={topo.name ?? ""}
              className="border-rule mt-1 block w-full border px-3 py-2"
            />
          </label>
          <label className="font-brown flex items-center gap-2 text-sm">
            <input type="checkbox" name="main" defaultChecked={topo.main} />
            Topo principal
          </label>
          <button
            type="submit"
            className="font-brown border-rule w-fit border px-4 py-2 text-xs tracking-[0.16em] uppercase"
          >
            Guardar topo
          </button>
        </form>
        <DrawForm
          topoId={topo.id}
          routes={routes}
          paths={paths}
          imageUrl={topo.imageUrl}
          publicId={topo.imagePublicId}
          width={topo.imageWidth ?? 1600}
          height={topo.imageHeight ?? 1200}
          strokeWidth={topo.routeStrokeWidth}
        />
      </section>
      <SiteFooter />
    </main>
  );
}
