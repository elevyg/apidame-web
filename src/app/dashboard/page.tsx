import Link from "next/link";
import { isAdminEmail, signOut } from "@/auth";
import { actorZoneIds, requireActor } from "@/lib/guide/authz";
import { listDashboardZones, listUsers } from "@/lib/guide/queries";
import { setPlatformAdmin, invitePlatformAdmin } from "./actions";

export default async function DashboardPage() {
  const actor = await requireActor();
  const zoneIds = await actorZoneIds(actor);
  const crags = await listDashboardZones(zoneIds);
  const people = actor.superAdmin ? await listUsers() : [];

  return (
    <section className="page-shell py-12">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="kicker">Admin</p>
          <h1 className="font-display mt-2 text-4xl">Guía deportiva</h1>
          <p className="font-brown text-ink-soft mt-3 max-w-xl text-sm leading-relaxed">
            {actor.email}
            {actor.superAdmin
              ? ". Super-admin: puedes nombrar otros admins de la plataforma."
              : actor.platformAdmin
                ? ". Admin de plataforma."
                : ". Elige una zona o busca para corregir una ruta."}
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="font-brown text-xs tracking-[0.16em] uppercase underline decoration-from-font underline-offset-4"
          >
            Salir
          </button>
        </form>
      </div>
      {crags.length === 0 ? (
        <p className="font-brown text-ink-soft mt-10 max-w-xl text-sm leading-relaxed">
          No tienes zonas asignadas. Un administrador de zona te tiene que
          agregar.
        </p>
      ) : (
        <ul className="divide-rule mt-10 divide-y border-rule border-y">
          {crags.map((zone) => (
            <li key={zone.id}>
              <Link
                href={`/dashboard/zonas/${zone.id}`}
                className="flex items-center justify-between py-5"
              >
                <span>
                  <span className="font-display block text-3xl">
                    {zone.name}
                  </span>
                  <span className="font-brown text-ink-soft mt-1 block text-xs tracking-[0.14em] uppercase">
                    {zone.published ? "Publicada" : "Oculta"}
                  </span>
                </span>
                <span className="font-brown text-xs tracking-[0.14em] uppercase underline decoration-from-font underline-offset-4">
                  Abrir
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {actor.superAdmin ? (
        <section className="mt-16 max-w-xl">
          <h2 className="font-display text-2xl">Admins de plataforma</h2>
          <p className="font-brown text-ink-soft mt-2 text-sm leading-relaxed">
            Un admin de plataforma ve todas las zonas. Solo tú puedes dar o
            quitar ese rol. El super-admin no se puede degradar.
          </p>
          <form action={invitePlatformAdmin} className="mt-6 grid gap-3">
            <label className="font-brown text-sm">
              Correo
              <input
                name="email"
                type="email"
                required
                className="border-rule mt-1 block w-full border px-3 py-2"
              />
            </label>
            <button
              type="submit"
              className="font-brown border-rule w-fit border px-4 py-2 text-xs tracking-[0.16em] uppercase"
            >
              Nombrar admin
            </button>
          </form>
          <ul className="divide-rule mt-6 divide-y border-rule border-y">
            {people.map((person) => {
              const locked = isAdminEmail(person.email);
              const isAdmin = person.role === "admin" || locked;
              return (
                <li
                  key={person.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <span>
                    <span className="font-brown block text-sm">
                      {person.email}
                    </span>
                    <span className="font-brown text-ink-soft text-xs tracking-[0.12em] uppercase">
                      {locked
                        ? "Super-admin"
                        : isAdmin
                          ? "Admin"
                          : "Usuario"}
                    </span>
                  </span>
                  {locked ? null : (
                    <form action={setPlatformAdmin}>
                      <input type="hidden" name="userId" value={person.id} />
                      <input
                        type="hidden"
                        name="role"
                        value={isAdmin ? "user" : "admin"}
                      />
                      <button
                        type="submit"
                        className="font-brown text-xs tracking-[0.14em] uppercase underline decoration-from-font underline-offset-4"
                      >
                        {isAdmin ? "Quitar admin" : "Hacer admin"}
                      </button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </section>
  );
}
