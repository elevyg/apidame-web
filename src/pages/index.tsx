import Logo from "assets/svgs/logo.svg";
import { type NextPage } from "next";
import { CldImage } from "next-cloudinary";

const Home: NextPage = () => {
  return (
    <>
      <main className="flex min-h-screen flex-col ">
        <div className="flex">
          <div className="z-10 m-6 hover:animate-spin">
            <Logo height={200} width={200} className="fill-primaryB" />
          </div>
          <CldImage
            src="apidame-web/splash-image"
            alt="Climber dynoing"
            width={4752}
            height={3168}
            className="absolute inset-0 h-full w-full object-cover"
            sizes="100vw"
            placeholder="blur"
          />
        </div>
      </main>
    </>
  );
};

export default Home;
