import Logo from "assets/svgs/logo.svg";
import { type NextPage } from "next";
import { CldImage, CldOgImage } from "next-cloudinary";

const Home: NextPage = () => {
  return (
    <>
      <CldOgImage
        src="apidame-web/splash-image"
        alt="Climber dynoing"
        width={2400}
        height={1200}
        overlays={[
          {
            publicId: "apidame-web/logo-white",
            width: 800,
            height: 800,
          },
        ]}
      />
      <main className="flex flex-col">
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
