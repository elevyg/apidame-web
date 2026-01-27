import Link from "next/link";
import Logo from "assets/svgs/icon-solo.svg";

export default function Topos() {
  return (
    <main>
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
      <iframe
        src="https://drive.google.com/embeddedfolderview?id=1-Be9uxgPKeD30336yjwvZa8czW9iBwNu#grid"
        className="h-96 w-full border-none"
      ></iframe>
    </main>
  );
}
