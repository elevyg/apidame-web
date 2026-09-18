import { notFound } from "next/navigation";
import Link from "next/link";
import { optimizedImageUrl } from "@/lib/climbing/cloudinary";
import { loadZoneAccess, requireActor } from "@/lib/guide/authz";
import { hasZoneAction, ROLE_HELP, ROLE_LABEL, ZONE_ROLES } from "@/lib/guide/zoneAccess";
import {
  getZoneById,
  listGuidePhotoLibrary,
  listZoneMembers,
} from "@/lib/guide/queries";
import {
  assignZoneRole,
  moveSector,
  orderSectorsNorthToSouth,
  removeZoneRole,
  updateZone,
} from "../../actions";
import AdminPhotoField from "../../AdminPhotoField";

type ZoneAdminProps = {
  params: Promise<{ zoneId: string }>;
};

export default async function ZoneAdminPage({ params }: ZoneAdminProps) {
  const { zoneId } = await params;
  const actor = await requireActor();
  const access = await loadZoneAccess(actor, zoneId);
  if (!access.platformAdmin && !access.role) notFound();
  const data = await getZoneById(zoneId);
  if (!data) notFound();
  const { zone, sectors, walls, routes, topos } = data;
  const canEditZone = hasZoneAction(access, "editZone");
  const canCreate = hasZoneAction(access, "create");
  const canAssign = hasZoneAction(access, "assignRole");
  const members = canAssign ? await listZoneMembers(zoneId) : [];
  const library = await listGuidePhotoLibrary();
  const coverUrl = zone.coverImageUrl
    ? optimizedImageUrl(
        { url: zone.coverImageUrl, publicId: zone.coverPublicId },
        1200,
      )
    : null;

  return (
    <section className="page-shell py-12">
      <Link
        href="/dashboard"
        className="font-brown text-ink-soft text-xs tracking-[0.14em] uppercase"
      >
        Guía
      </Link>
      <h1 className="font-display mt-2 text-4xl">{zone.name}</h1>
      {actor.superAdmin ? (
        <p className="font-brown text-ink-soft mt-2 text-xs tracking-[0.14em] uppercase">
          Super-admin
        </p>
      ) : access.platformAdmin ? (
        <p className="font-brown text-ink-soft mt-2 text-xs tracking-[0.14em] uppercase">
          Admin de plataforma
        </p>
      ) : access.role ? (
        <p className="font-brown text-ink-soft mt-2 text-xs tracking-[0.14em] uppercase">
          {ROLE_LABEL[access.role]}
        </p>
      ) : null}

      {canEditZone ? (
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
              rows={6}
              className="border-rule mt-2 block w-full border px-3 py-2"
            />
          </label>
          <AdminPhotoField
            currentUrl={coverUrl}
            currentAlt={zone.name}
            library={library}
          />
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
      ) : null}

      {canEditZone ? (
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
      ) : null}

      <div className="mt-14 flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl">Sectores</h2>
        {canCreate ? (
          <Link
            href={`/dashboard/agregar?kind=sector&zoneId=${zone.id}`}
            className="font-brown text-xs tracking-[0.14em] uppercase underline decoration-from-font underline-offset-4"
          >
            Agregar sector
          </Link>
        ) : null}
      </div>

      {sectors.map((sector) => {
        const sectorWalls = walls.filter((wall) => wall.sectorId === sector.id);
        return (
          <section
            key={sector.id}
            id={`sector-${sector.id}`}
            className="mt-10"
          >
            <div className="flex items-end justify-between gap-4">
              <h3 className="font-display text-2xl">{sector.name}</h3>
              {canCreate ? (
                <Link
                  href={`/dashboard/agregar?kind=pared&zoneId=${zone.id}&sectorId=${sector.id}`}
                  className="font-brown text-xs tracking-[0.14em] uppercase underline decoration-from-font underline-offset-4"
                >
                  Agregar pared
                </Link>
              ) : null}
            </div>
            <ul className="mt-4 grid gap-3">
              {sectorWalls.map((wall) => {
                const routeCount = routes.filter(
                  (route) => route.wallId === wall.id,
                ).length;
                const topoCount = topos.filter(
                  (topo) => topo.wallId === wall.id,
                ).length;
                const missingLines = routes.filter((route) => {
                  if (route.wallId !== wall.id) return false;
                  return !data.paths.some((path) => path.routeId === route.id);
                }).length;
                return (
                  <li key={wall.id} className="border-rule border p-4">
                    <Link
                      href={`/dashboard/paredes/${wall.id}`}
                      className="block"
                    >
                      <p className="font-display text-xl">{wall.name}</p>
                      <p className="font-brown text-ink-soft mt-1 text-xs">
                        {routeCount} rutas · {topoCount} topos
                        {missingLines > 0
                          ? ` · ${missingLines} sin línea`
                          : ""}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {canAssign ? (
        <section className="mt-16 max-w-xl">
          <h2 className="font-display text-2xl">Equipo</h2>
          <ul className="divide-rule mt-4 divide-y border-rule border-y">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <span>
                  <span className="font-brown block text-sm">
                    {member.email}
                  </span>
                  <span className="font-brown text-ink-soft text-xs tracking-[0.12em] uppercase">
                    {ROLE_LABEL[member.role as keyof typeof ROLE_LABEL] ??
                      member.role}
                  </span>
                </span>
                <form action={removeZoneRole}>
                  <input type="hidden" name="zoneId" value={zone.id} />
                  <input type="hidden" name="userId" value={member.userId} />
                  <button
                    type="submit"
                    className="font-brown text-xs tracking-[0.14em] uppercase underline decoration-from-font underline-offset-4"
                  >
                    Quitar
                  </button>
                </form>
              </li>
            ))}
          </ul>
          <form action={assignZoneRole} className="mt-6 grid gap-3">
            <input type="hidden" name="zoneId" value={zone.id} />
            <label className="font-brown text-sm">
              Correo
              <input
                name="email"
                type="email"
                required
                className="border-rule mt-1 block w-full border px-3 py-2"
              />
            </label>
            <p className="font-brown text-ink-soft text-xs leading-relaxed">
              Puede ser alguien que todavía no entra. El rol queda listo para
              cuando inicie sesión con ese Google.
            </p>
            <label className="font-brown text-sm">
              Rol
              <select
                name="role"
                className="border-rule mt-1 block w-full border px-3 py-2"
                defaultValue="collaborator"
              >
                {ZONE_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABEL[role]}
                  </option>
                ))}
              </select>
            </label>
            <ul className="font-brown text-ink-soft grid gap-2 text-xs leading-relaxed">
              {ZONE_ROLES.map((role) => (
                <li key={role}>
                  <span className="text-ink tracking-[0.08em] uppercase">
                    {ROLE_LABEL[role]}.
                  </span>{" "}
                  {ROLE_HELP[role]}
                </li>
              ))}
            </ul>
            <button
              type="submit"
              className="font-brown border-rule w-fit border px-4 py-2 text-xs tracking-[0.16em] uppercase"
            >
              Asignar
            </button>
          </form>
        </section>
      ) : null}
    </section>
  );
}
