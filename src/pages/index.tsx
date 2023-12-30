import { type NextPage } from "next";
import Logo from "assets/svgs/logo.svg";
import { CldImage } from "next-cloudinary";

const Home: NextPage = () => {
  return (
    <main className="flex flex-col">
      <nav className="flex h-24 items-center justify-center gap-2 bg-primaryA">
        <Logo height={50} width={50} className="fill-primaryB" />
        <h1 className="font-holluise text-5xl tracking-[0.4em] text-primaryB">
          APIDAME BOULDER
        </h1>
      </nav>
      <div className="relative h-screen">
        <div className="absolute inset-0 z-10 flex items-center justify-center  overflow-hidden">
          <CldImage
            src="apidame-web/vamos-a-escalar-complete"
            alt="Lets go climbing"
            width={2000}
            height={2000}
            className="w-2/3"
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
      <div className="flex h-screen justify-center bg-primaryB p-6">
        <h2 className="font-forgen text-5xl">Precios y horarios</h2>
      </div>
    </main>
  );
};

export default Home;
