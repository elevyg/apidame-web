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
      <div className="relative h-[60vh] md:h-screen">
        <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
          <CldImage
            src="apidame-web/vamos-a-escalar-complete"
            alt="Lets go climbing"
            width={2000}
            height={2000}
            className="px-10 md:w-2/3"
            placeholder="blur"
          />
        </div>
        <CldImage
          src="apidame-web/noise-background"
          alt="Climber dynoing"
          width={4752}
          height={3168}
          className="absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
          placeholder="blur"
        />
      </div>
      <div
        id="location"
        className="flex w-full flex-col justify-between bg-primaryA md:flex-row"
      >
        <div className="flex flex-col items-center justify-center gap-3  p-10 md:max-w-[50%]">
          <h2 className="font-forgen text-5xl text-primaryB">Ubicación</h2>
          <p className="font-brown text-primaryB">
            Nuestro centro se ubica en por el Camino Internacional, a 200 metros
            del límite urbano de Chile Chico. Este es nuestro letrero que da a
            la calle:
          </p>
          <CldImage
            src="apidame-web/apidame_street_sign_pnneko"
            alt="Entrance to Apidame Boulder"
            width={300}
            height={300}
            className="object-cover"
            sizes="100vw"
            placeholder="blur"
            aspectRatio="1:1"
          />
        </div>
        <div className="h-96 w-full md:h-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2744.2544530120053!2d-71.71614262295716!3d-46.54265308138484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xbded2b2de962d3c1%3A0x5b288c19fb231bd7!2sApidame%20Boulder!5e0!3m2!1ses!2scl!4v1704127632243!5m2!1ses!2scl"
            width="600"
            height="450"
            className="w-full min-w-full flex-1 border-none md:h-full"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <div
        id="prices-and-hours"
        className="flex flex-col gap-4 bg-primaryB  md:flex-row"
      >
        <div className="p-6 md:flex-1">
          <h2 className="font-forgen text-5xl">Horarios</h2>
          <p className="mt-4 font-brown text-xl">
            Contáctanos por Instagram para agendar tu sesión de escalada:
            <a
              className="ml-2 text-secondaryB underline"
              href="https://www.instagram.com/apidameboulder/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @apidameboulder
            </a>
          </p>
        </div>
        <div className="flex w-full items-center justify-center md:hidden">
          <Logo height={50} width={50} className="fill-primaryA" />
        </div>
        <div className="bg-primaryA p-6 text-white md:flex-1">
          <h2 className="font-forgen text-5xl">Precios</h2>
          <div className="flex flex-col gap-4 font-brown">
            <div>
              <h3 className="text-xl">Diario</h3>
              <p>$6.000</p>
            </div>
            <div>
              <h3 className="text-xl">Estudiantes y menores de 18 años*</h3>
              <p>$4.000</p>
              <p className="text-sm text-gray-700">
                * Acreditar con carnet o alguna credencial de estudiante
              </p>
            </div>
            <div>
              <h3 className="text-xl">3 días</h3>
              <p>$15.000</p>
            </div>
            <div>
              <h3 className="text-xl">1 semana</h3>
              <p>$20.000</p>
            </div>
            <div>
              <h3 className="text-xl">Membresía</h3>
              <p>
                Envíanos un correo a{" "}
                <a
                  className="text-secondaryB underline"
                  href="mailto:hola@apidame.com"
                >
                  hola@apidame.com
                </a>
              </p>
            </div>
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
