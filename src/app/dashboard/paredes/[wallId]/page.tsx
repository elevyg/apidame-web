import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { withFrenchGrade } from "@/lib/climbing/frenchGrade";
import { db } from "@/db/client";
import { routePaths, routes, topos } from "@/db/schema";
import { asc, eq, inArray } from "drizzle-orm";
import { optimizedImageUrl } from "@/lib/climbing/cloudinary";
import { loadZoneAccess, requireActor } from "@/lib/guide/authz";
import { hasZoneAction } from "@/lib/guide/zoneAccess";
import { getWallById, listGuidePhotoLibrary } from "@/lib/guide/queries";
import { createRoute, createTopo } from "../../actions";
import AdminPhotoField from "../../AdminPhotoField";

type WallAdminProps = {
  params: Promise<{ wallId: string }>;
};

export default async function WallAdminPage({ params }: WallAdminProps) {
  const { wallId } = await params;
  const context = await getWallById(wallId);
  if (!context) notFound();
  const { wall, sector, zone } = context;
  const actor = await requireActor();
  const access = await loadZoneAccess(actor, zone.id);
  if (!access.platformAdmin && !access.role) notFound();
  const canCreate = hasZoneAction(access, "create");
  const canSetMain = hasZoneAction(access, "setMainTopo");
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
  const routeIds = wallRoutes.map((route) => route.id);
  const paths =
    routeIds.length === 0
      ? []
      : await db
          .select()
          .from(routePaths)
          .where(inArray(routePaths.routeId, routeIds));
  const library = await listGuidePhotoLibrary();

  return (
    <section className="page-shell py-12">
      <p className="kicker">
        <Link href={`/dashboard/zonas/${zone.id}`}>{zone.name}</Link>
        {" · "}
        {sector.name}
      </p>
      <h1 className="font-display mt-2 text-4xl">{wall.name}</h1>

      <div className="mt-10 flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl">Topos</h2>
      </div>
      <ul className="mt-4 grid gap-3">
        {wallTopos.map((topo) => {
          const src = optimizedImageUrl(
            { url: topo.imageUrl, publicId: topo.imagePublicId },
            800,
          );
          return (
          <li
            key={topo.id}
            className="border-rule grid grid-cols-[7rem_1fr] items-center gap-4 border p-3"
          >
            <Image
              src={src}
              alt={topo.name ?? wall.name}
              width={topo.imageWidth ?? 280}
              height={topo.imageHeight ?? 210}
              unoptimized
              className="h-24 w-full object-cover"
            />
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-xl">{topo.name ?? "Topo"}</p>
                <p className="font-brown text-ink-soft text-xs tracking-[0.12em] uppercase">
                  {topo.main ? "Principal" : "Secundario"}
                </p>
              </div>
              <Link
                href={`/dashboard/topos/${topo.id}`}
                className="font-brown text-xs tracking-[0.14em] uppercase underline decoration-from-font underline-offset-4"
              >
                Modificar topo
              </Link>
            </div>
          </li>
          );
        })}
      </ul>

      {canCreate ? (
      <form
        action={createTopo}
        className="border-rule mt-6 grid max-w-xl gap-3 border p-4"
      >
        <h3 className="font-display text-xl">Agregar topo</h3>
        <input type="hidden" name="wallId" value={wall.id} />
        <label className="font-brown text-sm">
          Nombre
          <input
            name="name"
            className="border-rule mt-1 block w-full border px-3 py-2"
          />
        </label>
        <AdminPhotoField
          currentAlt="Nuevo topo"
          library={library}
          required
        />
        {canSetMain ? (
        <label className="font-brown flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="main"
            defaultChecked={wallTopos.length === 0}
          />
          Topo principal
        </label>
        ) : null}
        <button
          type="submit"
          className="font-brown border-rule w-fit border px-4 py-2 text-xs tracking-[0.16em] uppercase"
        >
          Crear topo
        </button>
      </form>
      ) : null}

      <div className="mt-14 flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl">Rutas</h2>
        {canCreate ? (
        <Link
          href={`/dashboard/agregar?kind=ruta&zoneId=${zone.id}&sectorId=${sector.id}&wallId=${wall.id}`}
          className="font-brown text-xs tracking-[0.14em] uppercase underline decoration-from-font underline-offset-4"
        >
          Agregar ruta
        </Link>
        ) : null}
      </div>
      <ul className="divide-rule mt-4 divide-y border-rule border-y">
        {wallRoutes.map(withFrenchGrade).map((route) => {
          const lined = paths.some((path) => path.routeId === route.id);
          return (
            <li key={route.id}>
              <Link
                href={`/dashboard/rutas/${route.id}`}
                className="flex items-baseline justify-between gap-4 py-4"
              >
                <span>
                  <span className="font-display text-xl">
                    {route.position}. {route.name}
                  </span>
                  <span className="font-brown text-ink-soft ml-3 text-sm">
                    {route.grade ?? "s/g"}
                  </span>
                </span>
                <span className="font-brown text-ink-soft text-xs tracking-[0.12em] uppercase">
                  {lined ? "Con línea" : "Sin línea"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {canCreate ? (
      <form
        action={createRoute}
        className="border-rule mt-8 grid max-w-xl gap-3 border p-4"
      >
        <h3 className="font-display text-xl">Ruta rápida</h3>
        <input type="hidden" name="wallId" value={wall.id} />
        <label className="font-brown text-sm">
          Nombre
          <input
            name="name"
            required
            className="border-rule mt-1 block w-full border px-3 py-2"
          />
        </label>
        <label className="font-brown text-sm">
          Grado
          <input
            name="grade"
            className="border-rule mt-1 block w-full border px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="font-brown border-rule w-fit border px-4 py-2 text-xs tracking-[0.16em] uppercase"
        >
          Crear y abrir ficha
        </button>
      </form>
      ) : null}
    </section>
  );
}
