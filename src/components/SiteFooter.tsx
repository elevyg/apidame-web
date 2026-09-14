import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="page-shell flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between md:py-14">
        <div className="flex flex-col gap-2">
          <p className="kicker">Desde 2021 · Chile Chico</p>
          <p className="font-brand text-sm tracking-[0.34em]">APIDAME BOULDER</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-brown text-xs text-ink-soft">
          <Link href="/topos" className="hover:text-ink">
            Topos
          </Link>
          <Link href="/#gimnasio" className="hover:text-ink">
            Gimnasio
          </Link>
          <a
            href="https://www.instagram.com/apidameboulder/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            Instagram
          </a>
          <Link href="/terminos-y-condiciones" className="hover:text-ink">
            Términos
          </Link>
          <Link href="/politicas-de-privacidad" className="hover:text-ink">
            Privacidad
          </Link>
        </nav>
      </div>
    </footer>
  );
}
