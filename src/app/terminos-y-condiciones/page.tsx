import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Nombre de la Empresa",
  description: "Términos y condiciones de uso de nuestro servicio.",
};

const TerminosYCondiciones: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 font-forgen text-black">
      <h1 className="mb-6 text-3xl font-bold">Términos y Condiciones</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          1. Aceptación de los Términos
        </h2>
        <p>
          Al acceder y utilizar este sitio web, usted acepta cumplir con estos
          términos y condiciones de uso. Si no está de acuerdo con alguna parte
          de estos términos, le pedimos que no utilice nuestro sitio web.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">2. Uso del Sitio</h2>
        <p>
          Usted se compromete a utilizar este sitio web solo para fines legales
          y de una manera que no infrinja los derechos de otros o restrinja o
          inhiba el uso y disfrute del sitio por parte de terceros.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          3. Propiedad Intelectual
        </h2>
        <p>
          Todo el contenido de este sitio web, incluyendo textos, gráficos,
          logotipos, imágenes y software, está protegido por derechos de autor y
          otras leyes de propiedad intelectual.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          4. Limitación de Responsabilidad
        </h2>
        <p>
          No nos hacemos responsables de ningún daño directo, indirecto,
          incidental, consecuente o punitivo que surja del uso o la
          imposibilidad de usar este sitio web.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">5. Modificaciones</h2>
        <p>
          Nos reservamos el derecho de modificar estos términos y condiciones en
          cualquier momento. Los cambios entrarán en vigor inmediatamente
          después de su publicación en el sitio web.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">6. Ley Aplicable</h2>
        <p>
          Estos términos y condiciones se regirán e interpretarán de acuerdo con
          las leyes de [país/región], sin tener en cuenta sus disposiciones
          sobre conflictos de leyes.
        </p>
      </section>

      <p className="mt-8 text-sm text-gray-600">
        Última actualización: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default TerminosYCondiciones;
