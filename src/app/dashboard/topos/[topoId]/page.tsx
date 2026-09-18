import { notFound } from "next/navigation";
import Link from "next/link";
import { optimizedImageUrl } from "@/lib/climbing/cloudinary";
import { getTopoEditor, listGuidePhotoLibrary } from "@/lib/guide/queries";
import { updateTopoMeta } from "../../actions";
import AdminPhotoField from "../../AdminPhotoField";

type TopoAdminProps = {
  params: Promise<{ topoId: string }>;
};

export default async function TopoAdminPage({ params }: TopoAdminProps) {
  const { topoId } = await params;
  const data = await getTopoEditor(topoId);
  if (!data) notFound();
  const { topo, wall, zone, routes, paths } = data;
  const library = await listGuidePhotoLibrary();
  const currentUrl = optimizedImageUrl(
    { url: topo.imageUrl, publicId: topo.imagePublicId },
    1200,
  );

  return (
    <section className="page-shell py-12">
      <p className="kicker">
        <Link href={`/dashboard/zonas/${zone.id}`}>{zone.name}</Link>
        {" · "}
        <Link href={`/dashboard/paredes/${wall.id}`}>{wall.name}</Link>
      </p>
      <h1 className="font-display mt-2 text-4xl">{topo.name ?? "Topo"}</h1>
      <form
        action={updateTopoMeta}
        className="mt-8 flex max-w-xl flex-col gap-3"
      >
        <input type="hidden" name="id" value={topo.id} />
        <label className="font-brown text-sm">
          Nombre
          <input
            name="name"
            defaultValue={topo.name ?? ""}
            className="border-rule mt-1 block w-full border px-3 py-2"
          />
        </label>
        <AdminPhotoField
          currentUrl={currentUrl}
          currentAlt={topo.name ?? wall.name}
          library={library}
        />
        <label className="font-brown flex items-center gap-2 text-sm">
          <input type="checkbox" name="main" defaultChecked={topo.main} />
          Topo principal de la pared
        </label>
        <button
          type="submit"
          className="font-brown border-rule w-fit border px-4 py-2 text-sm tracking-[0.16em] uppercase"
        >
          Guardar topo
        </button>
      </form>

      <h2 className="font-display mt-14 text-2xl">Rutas en este topo</h2>
      <ul className="divide-rule mt-4 divide-y border-rule border-y">
        {routes.map((route) => {
          const lined = paths.some((path) => path.routeId === route.id);
          return (
            <li key={route.id}>
              <Link
                href={`/dashboard/rutas/${route.id}`}
                className="flex items-baseline justify-between gap-4 py-4"
              >
                <span className="font-display text-xl">
                  {route.position}. {route.name}
                </span>
                <span className="font-brown text-ink-soft text-xs tracking-[0.12em] uppercase">
                  {lined ? "Editar línea" : "Agregar línea"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
