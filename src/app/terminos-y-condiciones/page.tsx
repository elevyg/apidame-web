import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "La escalada es peligrosa. El contenido de Apidame se usa bajo tu propio riesgo y no reemplaza a una guía o a un profesional de montaña.",
  alternates: { canonical: "/terminos-y-condiciones" },
};

export default function TerminosYCondiciones() {
  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />
      <article className="page-shell measure py-12 font-brown md:py-16">
        <p className="kicker">Legal</p>
        <h1 className="font-display mt-3 text-4xl">Términos y condiciones</h1>
        <p className="text-ink-soft mt-4 text-sm">Septiembre 2026</p>

        <section className="mt-10">
          <h2 className="font-display text-2xl">1. Aceptación</h2>
          <p className="text-ink-soft mt-3 leading-relaxed">
            Al entrar a este sitio aceptas estos términos. Si no estás de
            acuerdo, no lo uses. El sitio lo publica Apidame desde Chile Chico.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">
            2. La escalada es peligrosa
          </h2>
          <p className="text-ink-soft mt-3 leading-relaxed">
            La escalada, el boulder y las actividades de montaña son deportes
            inherentemente peligrosos. Pueden causar lesiones graves,
            discapacidad permanente o la muerte. Nada de lo que leas aquí reduce
            ese riesgo. No nos hacemos cargo de tu seguridad ni de la de
            terceros.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">
            3. Esto no es consejo de guía ni de profesional de montaña
          </h2>
          <p className="text-ink-soft mt-3 leading-relaxed">
            El contenido —notas, topos, fotos, opiniones de equipo, horarios del
            muro y cualquier otra información— es personal y general. No es
            instrucción profesional, no es una guía de montaña y no sustituye
            formación, criterio ni experiencia propia. Si tienes dudas sobre tu
            capacidad para hacer una ruta o una maniobra, no la intentes. Busca
            instrucción calificada.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">
            4. La información puede estar desactualizada o ser errónea
          </h2>
          <p className="text-ink-soft mt-3 leading-relaxed">
            Descripciones, grados, protección fija, reuniones, accesos,
            aproximaciones, descensos, condiciones del muro y cualquier otro
            dato pueden estar mal, incompletos o haber cambiado. La roca, los
            anclajes y el clima cambian. La protección fija puede faltar, estar
            en otro lado o fallar. Los errores de quien escribe, de quien
            informa y de la edición son posibles. Trátalo como opinión de un
            momento, no como un hecho. Verifica por tu cuenta antes de
            comprometerte.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">5. Tu responsabilidad</h2>
          <p className="text-ink-soft mt-3 leading-relaxed">
            Usas este sitio y actúas según lo que lees bajo tu propio riesgo.
            Eres responsable de evaluar tu habilidad, tu equipo, las
            condiciones y cada decisión en la pared, en el muro o en la
            montaña. Si usas alguna información de aquí para planear o intentar
            una ruta, asumes ese riesgo. Eres la única persona a cargo de tu
            seguridad.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">
            6. Limitación de responsabilidad
          </h2>
          <p className="text-ink-soft mt-3 leading-relaxed">
            El sitio se ofrece tal como está, sin garantías de exactitud,
            vigencia ni idoneidad. En la máxima medida que permita la ley
            chilena, Apidame y quienes publicamos este sitio no respondemos por
            daño, lesión, muerte o pérdida derivados del uso del sitio o de
            cualquier contenido. Nada de esto excluye responsabilidades que la
            ley no permita excluir.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">7. Contenido del sitio</h2>
          <p className="text-ink-soft mt-3 leading-relaxed">
            Textos, fotos, topos, marcas y demás material están protegidos por
            derechos de autor. Puedes usarlos para tu propia salida. No los
            reproduzcas con fines comerciales sin permiso.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">8. Cambios</h2>
          <p className="text-ink-soft mt-3 leading-relaxed">
            Podemos actualizar estos términos. La versión vigente es la que
            está publicada en esta página.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl">9. Ley aplicable</h2>
          <p className="text-ink-soft mt-3 leading-relaxed">
            Estos términos se rigen por las leyes de Chile.
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
