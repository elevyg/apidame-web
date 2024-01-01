import { type NextPage } from "next";
import Logo from "assets/svgs/icon-solo.svg";
import { CldImage } from "next-cloudinary";

const Home: NextPage = () => {
  return (
    <main className="flex flex-col">
      <nav className="flex items-center justify-center gap-4 bg-primaryA py-4 md:py-6">
        <Logo height={50} width={50} className="fill-primaryB" />
        <h1 className="font-holluise text-2xl tracking-[0.4em] text-primaryB md:text-5xl">
          APIDAME BOULDER
        </h1>
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
      <div className="flex flex-col justify-between bg-primaryA md:flex-row ">
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-3 py-6">
          <h2 className="font-forgen text-5xl text-primaryB">Ubicación</h2>
          <p className="font-brown text-primaryB">
            Nuestro centro se ubica en por el Camino Internacional, a 200 metros
            del límite urbano de Chile Chico.
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
        <div className="h-96 md:h-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2744.2544530120053!2d-71.71614262295716!3d-46.54265308138484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xbded2b2de962d3c1%3A0x5b288c19fb231bd7!2sApidame%20Boulder!5e0!3m2!1ses!2scl!4v1704127632243!5m2!1ses!2scl"
            width="600"
            height="450"
            className="min-w-[100%] flex-1 border-none md:h-full md:min-w-[50%]"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <div className="flex flex-col justify-evenly gap-4 bg-primaryB p-6 md:flex-row">
        <div>
          <h2 className="font-forgen text-5xl">Horarios</h2>
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl">Martes a Viernes</h3>
              <p>17:00 a 22:00</p>
            </div>
            <div>
              <h3 className="text-xl">Sábado</h3>
              <p>10:00 a 14:00</p>
              <p>17:00 a 22:00</p>
            </div>
            <div>
              <h3 className="text-xl">Domingo y festivos</h3>
              <p>Cerrado en principio</p>
              <p>
                Cualquier cambio se publicará en nuestro Instagram
                @apidameboulder
              </p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="font-forgen text-5xl">Precios</h2>
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl">Diario</h3>
              <p>$6.000</p>
            </div>
            <div>
              <h3 className="text-xl">3 días</h3>
              <p>$15.000</p>
            </div>
            <div>
              <h3 className="text-xl">1 semana</h3>
              <p>$20.000</p>
            </div>
          </div>
        </div>
      </div>
      <footer className="flex items-center justify-center gap-4 bg-primaryA py-4 md:py-6">
        <Logo height={50} width={50} className="fill-primaryB" />
        <h1 className="font-holluise text-2xl tracking-[0.4em] text-primaryB md:text-5xl">
          APIDAME BOULDER
        </h1>
      </footer>
    </main>
  );
};

export default Home;
