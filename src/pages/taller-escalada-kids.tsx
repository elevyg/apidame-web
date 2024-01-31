import { type NextPage } from "next";
import Logo from "assets/svgs/icon-solo.svg";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <main className="flex flex-col">
      <nav className="">
        <Link
          className="flex items-center justify-center gap-4 bg-primaryA py-4 md:py-6"
          href="/"
        >
          <Logo
            height={50}
            width={50}
            className="h-p[30px] w-[30px] fill-primaryB md:h-[50px] md:w-[50px]"
          />
          <h1 className="font-holluise text-xl tracking-[0.4em] text-primaryB md:text-5xl">
            APIDAME BOULDER
          </h1>
        </Link>
      </nav>
      <div className="relative flex flex-col overflow-hidden p-10 md:flex-row">
        <div className="absolute inset-0  z-0 bg-[url(https://res.cloudinary.com/dzyy8nvgd/image/upload/c_scale,q_auto,w_500/v1704542059/apidame-web/vamos_a_escalar_kids_bg_t2l80k.png)] bg-repeat"></div>
        <CldImage
          src="apidame-web/taller_de_escalada_kids_uzwz5q"
          alt="Taller de escalada kids"
          width={800}
          height={900}
          className="z-10 flex-1 object-contain"
          sizes="100vw"
          placeholder="blur"
        />
        <div className="landing-container relative flex flex-1 flex-col gap-4 bg-white p-4 font-brown md:pl-5">
          <h1 className="font-forgen text-3xl">
            ¡Descubre el emocionante mundo de la escalada para niños en Apidame
            Boulder!
          </h1>
          <p>
            Bienvenido al taller de escalada kids, diseñado para introducir a
            tus hijos en la emoción y la diversión de la escalada indoor. En
            Apidame Boulder, ofrecemos una experiencia única que combina
            aprendizaje, aventura y seguridad.
          </p>

          <div className="details-container">
            <h2>Detalles del Taller:</h2>
            <ul>
              <li>Días: Martes y jueves</li>
              <li>Horario: 6:30 pm a 7:30 pm</li>
              <li>
                Duración: Enero y Febrero 
              </li>
              <li>Tarifa Mensual: $45.000</li>
            </ul>
          </div>

          <p>
            Nuestro compromiso es proporcionar a los participantes un ambiente
            seguro, supervisado por instructores especializados que guiarán a
            los niños en su emocionante viaje vertical. No se requieren
            zapatillas de escalada, ya que contamos con opciones para prestar,
            ¡y también ofrecemos la posibilidad de compra para aquellos que
            deseen su propio par!
          </p>

          <div className="why-join-container">
            <h2>
              ¿Por qué unirse al Taller de Escalada Kids en Apidame Boulder?
            </h2>
            <ul>
              <li>Desarrollo de habilidades físicas y mentales.</li>
              <li>Construcción de confianza y autoestima.</li>
              <li>Diversión garantizada en un ambiente amigable.</li>
            </ul>
          </div>

          <p>
            Inscríbete ahora y permite que tus hijos experimenten la emoción de
            escalar en Apidame Boulder, el corazón de la aventura vertical en
            Chile Chico! 🏞️
          </p>

          <div className="hashtags-container">
            <span>#ApidameBoulder</span>
            <span>#EscaladaKids</span>
            <span>#AventuraVertical</span>
          </div>
        </div>
      </div>
      <footer className="flex items-center justify-center gap-4 bg-primaryA py-4 md:py-10">
        <Logo
          height={50}
          width={50}
          className="h-p[30px] w-[30px] fill-primaryB md:h-[50px] md:w-[50px]"
        />
        <h1 className="font-holluise text-xl tracking-[0.4em] text-primaryB md:text-5xl">
          APIDAME BOULDER
        </h1>
      </footer>
    </main>
  );
};

export default Home;
