import Link from "next/link";
import Logo from "assets/svgs/icon-solo.svg";

export default function Topos() {
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-primaryA">
      <nav className="shrink-0">
        <Link
          className="flex items-center justify-center gap-4 bg-primaryA py-4 md:py-6"
          href="/"
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

      <div className="flex min-h-0 flex-1 flex-col p-4 md:p-8">
        <div className="y2k-accent-bar mb-4 shrink-0" />

        <div className="y2k-panel flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-between border-b-2 border-secondaryA/30 px-4 py-3">
            <h2 className="font-forgen text-2xl text-primaryB md:text-3xl">
              TOPOS
            </h2>
            <div className="flex items-center gap-3">
              <span className="font-brown text-xs text-primaryB/50">
                ↕ scroll
              </span>
              <div className="flex gap-1">
                <span className="h-3 w-3 rounded-full bg-secondaryA/50" />
                <span className="h-3 w-3 rounded-full bg-secondaryB/50" />
              </div>
            </div>
          </div>

          <div className="relative min-h-0 flex-1 p-(--spacing-panel)">
            <div className="y2k-panel-sunken absolute inset-0 m-(--spacing-panel)">
              <iframe
                src="https://drive.google.com/embeddedfolderview?id=1-Be9uxgPKeD30336yjwvZa8czW9iBwNu#grid"
                className="h-full w-full border-none"
              />
            </div>
          </div>
        </div>

        <div className="y2k-accent-bar mt-4 shrink-0" />
      </div>
    </main>
  );
}
