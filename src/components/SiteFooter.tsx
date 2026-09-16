import Link from "next/link";
import TrackedLink from "@/components/TrackedLink";
import { siteNav } from "@/components/siteNav";

export default function SiteFooter() {
  return (
    <footer className="border-rule border-t">
      <div className="page-shell flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between md:py-14">
        <div className="flex flex-col gap-2">
          <p className="kicker">Desde 2021 · Chile Chico</p>
          <p className="font-brand text-sm tracking-[0.34em]">APIDAME</p>
        </div>
        <nav className="font-brown text-ink-soft flex flex-wrap gap-x-6 gap-y-2 text-xs">
          {siteNav.map((item) =>
            item.href.startsWith("/#") ? (
              <a key={item.id} href={item.href} className="hover:text-ink">
                {item.label}
              </a>
            ) : (
              <Link key={item.id} href={item.href} className="hover:text-ink">
                {item.label}
              </Link>
            ),
          )}
          <TrackedLink
            href="https://www.instagram.com/apidameboulder/"
            event="instagram_clicked"
            properties={{ source: "footer", handle: "apidameboulder" }}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            Instagram
          </TrackedLink>
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
