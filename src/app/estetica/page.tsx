import type { Metadata } from "next";
import ArchivoFotos from "@/components/estetica/ArchivoFotos";
import ProjectField from "@/components/estetica/ProjectField";

export const metadata: Metadata = {
  title: "Estética",
  robots: { index: false, follow: false },
};

export default function EsteticaPage() {
  return (
    <main className="flex flex-col bg-paper text-ink">
      <ProjectField lab />

      <section id="notas" className="border-t border-rule py-20 md:py-28">
        <div className="page-shell max-w-3xl">
          <p className="kicker">Cómo está ordenado</p>
          <h2 className="font-display mt-4 text-3xl md:text-5xl">
            La marca primero, los proyectos después
          </h2>
          <p className="mt-6 font-brown text-base leading-relaxed text-ink-soft">
            El hero fusiona el aéreo de la Proa con el galpón nevado:
            un dissolve largo, plus-lighter, para que se mezclen en
            el medio. Al salir aparece la barra. Después muro, cerro
            y deportiva, igual que antes.
          </p>
        </div>
      </section>

      <ArchivoFotos />

      <section
        id="preguntas"
        className="page-shell border-t border-rule py-20 md:max-w-3xl md:py-28"
      >
        <p className="kicker">Para discutir</p>
        <h2 className="font-display mt-4 text-3xl md:text-4xl">
          Lo que quiero que mires
        </h2>
        <ol className="mt-10 space-y-10 font-brown text-base leading-relaxed">
          <li>
            <p className="text-ink">La fusión</p>
            <p className="mt-2 text-ink-soft">
              Proa aérea y galpón. Si el dissolve queda sucio, se baja
              a un crossfade normal. Si el par no es el correcto, en
              el archivo hay más de la guía.
            </p>
          </li>
          <li>
            <p className="text-ink">El nav sobre la foto</p>
            <p className="mt-2 text-ink-soft">
              Columna a la derecha, sin barra. Al hacer scroll baja una
              barra con las mismas palabras. ¿Se entiende el corte?
            </p>
          </li>
          <li>
            <p className="text-ink">El cerro solo</p>
            <p className="mt-2 text-ink-soft">
              Sigue con la guía. El aéreo de Sergi ahora vive en el
              hero. ¿Hay que repetirlo abajo?
            </p>
          </li>
        </ol>
      </section>
    </main>
  );
}
