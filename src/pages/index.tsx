import { type NextPage } from "next";
import Logo from "assets/svgs/logo.svg";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <>
      <main className="flex min-h-screen flex-col ">
        <div className="flex">
          <div className="z-10 m-6 hover:animate-spin">
            <Logo height={200} width={200} className="fill-primaryB" />
          </div>
          <Image
            src="https://res.cloudinary.com/dzyy8nvgd/image/upload/v1670323578/apidame-web/IMG_5147.CR2_jnr28e.jpg"
            alt="Climber dynoing"
            width={4752}
            height={3168}
            className="absolute inset-0 h-full w-full object-cover "
          />
        </div>
      </main>
    </>
  );
};

export default Home;
