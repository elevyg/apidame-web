import Link from "next/link";
import { auth, signOut } from "@/auth";
import { listAllZones } from "@/lib/guide/queries";

export default async function DashboardPage() {
  const session = await auth();
  const crags = await listAllZones();

  return (
    <section className="page-shell py-12">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="kicker">Admin</p>
          <h1 className="font-display mt-2 text-4xl">Guía deportiva</h1>
          <p className="font-brown text-ink-soft mt-3 max-w-xl text-sm leading-relaxed">
            {session?.user?.email}. Elige una zona o busca para corregir una
            ruta.
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
      <ul className="divide-rule mt-10 divide-y border-rule border-y">
        {crags.map((zone) => (
          <li key={zone.id}>
            <Link
              href={`/dashboard/zonas/${zone.id}`}
              className="flex items-center justify-between py-5"
            >
              <span>
                <span className="font-display block text-3xl">{zone.name}</span>
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
    </section>
  );
}
