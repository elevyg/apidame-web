import Link from "next/link";
import Logo from "assets/svgs/icon-solo.svg";
import TopoClient from "../TopoClient";

export default function ProaRepisa() {
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-primaryA">
      <nav className="shrink-0">
        <Link
          className="flex items-center justify-center gap-4 bg-primaryA py-4 md:py-6"
          href="/topos"
        >
          <Logo
            height={50}
            width={50}
            className="h-[30px] w-[30px] fill-primaryB md:h-[50px] md:w-[50px]"
          />
          <h1 className="font-holluise text-xl tracking-[0.4em] text-primaryB md:text-5xl">
            APIDAME BOULDER
          </h1>
        </Link>
      </nav>

      <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 md:p-8">
        <div className="y2k-accent-bar shrink-0" />

        <TopoClient />

        <div className="y2k-accent-bar shrink-0" />
      </div>
    </main>
  );
}
