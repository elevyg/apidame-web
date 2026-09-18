import { signIn } from "@/auth";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />
      <section className="page-shell flex flex-1 flex-col justify-center py-20">
        <p className="kicker">Cuenta</p>
        <h1 className="font-display mt-4 text-4xl md:text-6xl">Entrar</h1>
        <p className="measure font-brown text-ink-soft mt-6 text-base">
          Solo Google. El dashboard queda para quien tenga un rol en alguna
          zona.
        </p>
        <form
          className="mt-10"
          action={async () => {
            "use server";
            await signIn("google", {
              redirectTo: callbackUrl || "/dashboard",
            });
          }}
        >
          <button
            type="submit"
            className="font-brown border-rule border px-5 py-3 text-sm tracking-[0.16em] uppercase"
          >
            Continuar con Google
          </button>
        </form>
      </section>
      <SiteFooter />
    </main>
  );
}
