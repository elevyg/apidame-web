import { type NextPage } from "next";
import { CldImage } from "next-cloudinary";

const Home: NextPage = () => {
  return (
    <main className="flex flex-col">
      <div className="h-screen">
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
      <div className="h-screen bg-primaryB"></div>
    </main>
  );
};

export default Home;
