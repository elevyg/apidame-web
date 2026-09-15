"use client";

import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import ApidameMark from "@/components/estetica/ApidameMark";
import { siteNav, type SiteNavId } from "@/components/siteNav";

type SiteHeaderProps = {
  current?: SiteNavId;
  tone?: "paper" | "canvas";
  pinned?: boolean;
  overlay?: boolean;
  local?: boolean;
  markHref?: string;
};

function navClass(
  paper: boolean,
  active: boolean,
  variant: "inline" | "panel",
) {
  if (variant === "panel") {
    return `block py-4 font-brown text-xs tracking-[0.2em] uppercase ${
      paper ? "text-ink" : "text-paper"
    }`;
  }

  return `font-brown text-[10px] tracking-[0.12em] uppercase whitespace-nowrap transition md:text-xs md:tracking-[0.18em] ${
    paper
      ? active
        ? "text-ink"
        : "text-ink-soft hover:text-ink"
      : active
        ? "text-paper"
        : "text-white/70 hover:text-paper"
  }`;
}

export default function SiteHeader({
  current,
  tone = "paper",
  pinned = false,
  overlay = false,
  local = false,
  markHref = "/",
}: SiteHeaderProps) {
  const paper = tone === "paper";
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(!overlay);
  const [revealReady, setRevealReady] = useState(!overlay);
  const headerRef = useRef<HTMLElement>(null);
  const menuId = useId();
  const close = () => setOpen(false);

  const chrome = paper
    ? "border-rule bg-paper/95 backdrop-blur-sm"
    : "border-white/20 bg-canvas text-paper";
  const position = overlay
    ? `fixed inset-x-0 top-0 z-40 ${
        revealReady
          ? "transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:translate-y-0"
          : ""
      } ${
        revealed
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-3 opacity-0 motion-reduce:translate-y-0"
      }`
    : pinned
      ? "relative"
      : "sticky top-0 z-30 relative";
  const mark = (
    <>
      <ApidameMark tone={paper ? "ink" : "paper"} />
      <span className="sr-only">Apidame</span>
    </>
  );

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const apply = () => {
      document.documentElement.style.setProperty(
        "--site-header-h",
        `${el.getBoundingClientRect().height}px`,
      );
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!overlay) return;

    const read = () => {
      const hero = document.querySelector("[data-home-hero]");
      const next = hero
        ? hero.getBoundingClientRect().top < -64
        : window.scrollY > 64;
      setRevealed((prev) => (prev === next ? prev : next));
    };

    read();
    const frame = window.requestAnimationFrame(() => setRevealReady(true));
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [overlay]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) setOpen(false);
    };

    const onScroll = () => setOpen(false);

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  const items = siteNav.map((item) => {
    const href = local ? item.homeHref : item.href;
    const active = current === item.id;
    return { ...item, href, active };
  });

  return (
    <header
      ref={headerRef}
      inert={overlay && !revealed ? true : undefined}
      aria-hidden={overlay && !revealed ? true : undefined}
      className={`${position} border-b ${chrome}`}
    >
      <div className="page-shell flex h-14 items-center justify-between gap-4 md:h-16">
        {markHref.startsWith("#") ? (
          <a href={markHref} className="shrink-0" onClick={close}>
            {mark}
          </a>
        ) : (
          <Link href={markHref} className="shrink-0" onClick={close}>
            {mark}
          </Link>
        )}

        <nav className="hidden min-w-0 items-center justify-end gap-3 md:flex lg:gap-5 xl:gap-8">
          {items.map((item) => {
            const className = navClass(paper, item.active, "inline");
            if (item.href.startsWith("#") || item.href.startsWith("/#")) {
              return (
                <a key={item.id} href={item.href} className={className}>
                  {item.label}
                </a>
              );
            }
            return (
              <Link key={item.id} href={item.href} className={className}>
                {item.label}
              </Link>
            );
          })}
          <a
            href="https://www.instagram.com/apidameboulder/"
            target="_blank"
            rel="noopener noreferrer"
            className={`font-brown text-[10px] tracking-[0.16em] uppercase transition md:text-xs md:tracking-[0.18em] ${
              paper
                ? "text-ink-soft hover:text-ink"
                : "hover:text-paper text-white/70"
            }`}
          >
            Instagram
          </a>
        </nav>

        <button
          type="button"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Cerrar" : "Menú"}
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden className="relative block h-3 w-5">
            <span
              className={`absolute top-0 left-0 h-px w-full origin-center transition duration-200 ${
                paper ? "bg-ink" : "bg-paper"
              } ${open ? "top-1.5 rotate-45" : ""}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-full origin-center transition duration-200 ${
                paper ? "bg-ink" : "bg-paper"
              } ${open ? "bottom-1.5 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {open ? (
        <div className="md:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            className={`absolute inset-x-0 top-full z-10 h-dvh touch-none ${
              paper ? "bg-ink/30" : "bg-black/55"
            }`}
            onClick={close}
          />
          <nav
            id={menuId}
            className={`absolute inset-x-0 top-full z-20 border-b ${
              paper ? "border-rule bg-paper" : "bg-canvas border-white/20"
            }`}
          >
            <div
              className={`page-shell divide-y ${
                paper ? "divide-rule" : "divide-white/20"
              }`}
            >
              {items.map((item) => {
                const className = navClass(paper, item.active, "panel");
                if (item.href.startsWith("#") || item.href.startsWith("/#")) {
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      className={className}
                      onClick={close}
                    >
                      {item.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={className}
                    onClick={close}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <a
                href="https://www.instagram.com/apidameboulder/"
                target="_blank"
                rel="noopener noreferrer"
                className={navClass(paper, false, "panel")}
                onClick={close}
              >
                Instagram
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
