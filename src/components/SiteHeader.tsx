import Link from "next/link";
import Logo from "assets/svgs/icon-solo.svg";

type SiteHeaderProps = {
  current?: "topos" | "gimnasio";
};

const nav = [
  { href: "/topos", label: "Topos", id: "topos" as const },
  { href: "/#gimnasio", label: "Gimnasio", id: "gimnasio" as const },
];

export default function SiteHeader({ current }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <div className="page-shell flex h-14 items-center justify-between gap-4 md:h-16">
        <Link href="/" className="flex items-center gap-3">
          <Logo
            height={28}
            width={30}
            className="h-6 w-6 fill-ink md:h-7 md:w-7"
            aria-hidden
          />
          <span className="flex flex-col leading-none">
            <span className="font-brand text-[11px] tracking-[0.34em] md:text-sm">
              APIDAME
            </span>
            <span className="font-brand text-[8px] tracking-[0.42em] text-ink-soft md:text-[10px]">
              BOULDER
            </span>
          </span>
          <span className="sr-only">Apidame Boulder, inicio</span>
        </Link>

        <nav className="flex items-center gap-5 md:gap-8">
          {nav.map((item) => {
            const active = current === item.id;
            const className = `font-brown text-[11px] tracking-[0.18em] uppercase transition md:text-xs ${
              active ? "text-ink" : "text-ink-soft hover:text-ink"
            }`;
            if (item.href.startsWith("/#")) {
              return (
                <a key={item.href} href={item.href} className={className}>
                  {item.label}
                </a>
              );
            }
            return (
              <Link key={item.href} href={item.href} className={className}>
                {item.label}
              </Link>
            );
          })}
          <a
            href="https://www.instagram.com/apidameboulder/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden font-brown text-[11px] tracking-[0.18em] text-ink-soft uppercase transition hover:text-ink md:inline md:text-xs"
          >
            Instagram
          </a>
        </nav>
      </div>
    </header>
  );
}
