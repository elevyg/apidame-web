import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function PrivacyPolicy() {
  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />
      <article className="page-shell measure font-brown py-12 md:py-16">
        <p className="kicker">Legal</p>
        <h1 className="font-display mt-3 text-4xl">Política de privacidad</h1>

        <section className="mt-10">
          <h2 className="font-display text-2xl">1. Introducción</h2>
          <p className="text-ink-soft mt-3 leading-relaxed">
            Bienvenido a Apidame Boulder. Respetamos tu privacidad y nos
            comprometemos a proteger tus datos personales.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">2. Información que reunimos</h2>
          <p className="text-ink-soft mt-3 leading-relaxed">
            Podemos reunir, usar, almacenar y transferir distintos tipos de
            datos personales, incluyendo:
          </p>
          <ul className="text-ink-soft mt-3 list-disc space-y-1 pl-5">
            <li>Datos de identidad</li>
            <li>Datos de contacto</li>
            <li>Datos técnicos</li>
            <li>Datos de uso</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">
            3. Cómo usamos la información
          </h2>
          <p className="text-ink-soft mt-3 leading-relaxed">
            Usamos tus datos personales para, entre otras cosas:
          </p>
          <ul className="text-ink-soft mt-3 list-disc space-y-1 pl-5">
            <li>Prestar y mantener el servicio</li>
            <li>Avisarte de cambios en el servicio</li>
            <li>Permitir el uso de funciones interactivas</li>
            <li>Dar soporte</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">4. Seguridad de los datos</h2>
          <p className="text-ink-soft mt-3 leading-relaxed">
            Implementamos medidas de seguridad para evitar que tus datos
            personales se pierdan, se usen o se accedan de forma no autorizada.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">5. Tus derechos</h2>
          <p className="text-ink-soft mt-3 leading-relaxed">
            En ciertas circunstancias tienes derechos sobre tus datos
            personales, incluyendo el derecho a acceder, corregir o eliminar esa
            información.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">6. Analítica</h2>
          <p className="text-ink-soft mt-3 leading-relaxed">
            Usamos Google Analytics y PostHog para entender cómo se usa el sitio
            (páginas visitadas, clics y errores). Esa información nos sirve para
            mejorar el muro, los topos y las notas. No vendemos tus datos.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">7. Contacto</h2>
          <p className="text-ink-soft mt-3 leading-relaxed">
            Si tienes preguntas sobre esta política, escribe a{" "}
            <a
              className="text-ink underline decoration-from-font underline-offset-4"
              href="mailto:privacy@apidameboulder.com"
            >
              privacy@apidameboulder.com
            </a>
            .
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
