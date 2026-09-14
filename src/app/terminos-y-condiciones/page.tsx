import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function TerminosYCondiciones() {
  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />
      <article className="page-shell measure py-12 font-brown md:py-16">
        <p className="kicker">Legal</p>
        <h1 className="font-display mt-3 text-4xl">Términos y condiciones</h1>

        <section className="mt-10">
          <h2 className="font-display text-2xl">1. Aceptación de los términos</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Al acceder y utilizar este sitio web, usted acepta cumplir con estos
            términos y condiciones de uso. Si no está de acuerdo con alguna
            parte de estos términos, le pedimos que no utilice nuestro sitio
            web.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">2. Uso del sitio</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Usted se compromete a utilizar este sitio web solo para fines
            legales y de una manera que no infrinja los derechos de otros o
            restrinja o inhiba el uso y disfrute del sitio por parte de
            terceros.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">3. Propiedad intelectual</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Todo el contenido de este sitio web, incluyendo textos, gráficos,
            logotipos, imágenes y software, está protegido por derechos de
            autor y otras leyes de propiedad intelectual.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">
            4. Limitación de responsabilidad
          </h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            No nos hacemos responsables de ningún daño directo, indirecto,
            incidental, consecuente o punitivo que surja del uso o la
            imposibilidad de usar este sitio web.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">5. Modificaciones</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Nos reservamos el derecho de modificar estos términos y condiciones
            en cualquier momento. Los cambios entrarán en vigor inmediatamente
            después de su publicación en el sitio web.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">6. Ley aplicable</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Estos términos y condiciones se regirán e interpretarán de acuerdo
            con las leyes de Chile, sin tener en cuenta sus disposiciones sobre
            conflictos de leyes.
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
