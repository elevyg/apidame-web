import Link from "next/link";
import { auth, signOut } from "@/auth";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { listAllZones } from "@/lib/guide/queries";

export default async function DashboardPage() {
  const session = await auth();
  const crags = await listAllZones();

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />
      <section className="page-shell py-12">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="kicker">Admin</p>
            <h1 className="font-display mt-2 text-4xl">Guía deportiva</h1>
            <p className="font-brown text-ink-soft mt-3 text-sm">
              {session?.user?.email}
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
            <li key={zone.id} className="flex items-center justify-between py-4">
              <div>
                <p className="font-display text-2xl">{zone.name}</p>
                <p className="font-brown text-ink-soft text-xs tracking-[0.14em] uppercase">
                  {zone.published ? "Publicada" : "Oculta"}
                </p>
              </div>
              <Link
                href={`/dashboard/zonas/${zone.id}`}
                className="font-brown text-sm tracking-[0.14em] uppercase underline decoration-from-font underline-offset-4"
              >
                Editar
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <SiteFooter />
    </main>
  );
}
