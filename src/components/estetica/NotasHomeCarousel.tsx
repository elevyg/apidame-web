"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { NotaShared } from "@/components/estetica/feed/NotaShared";
import {
  notaCoverName,
  notasIndexTitleName,
  notaTitleName,
} from "@/components/estetica/feed/notaTransition";
import type { PostCover } from "@/components/estetica/feed/posts";

export type HomeNote = {
  slug: string;
  title: string;
  cover?: PostCover;
};

const cardClass =
  "h-full min-h-0 w-[calc(100%-1.25rem)] shrink-0 snap-start md:w-[90%]";

type NotasHomeCarouselProps = {
  notes: readonly HomeNote[];
};

export default function NotasHomeCarousel({ notes }: NotasHomeCarouselProps) {
  const panelRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const showUpcoming = notes.length < 2;

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const intro = introRef.current;
    if (!panel || !intro) return;

    const apply = () => {
      panel.style.setProperty("--notas-intro-h", `${intro.offsetHeight}px`);
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(intro);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const update = () => {
      const cards = el.querySelectorAll("[data-notas-card]");
      const first = cards[0];
      const last = cards[cards.length - 1];
      if (!(first instanceof HTMLElement) || !(last instanceof HTMLElement)) {
        setCanPrev(false);
        setCanNext(false);
        return;
      }

      const origin = el.getBoundingClientRect().left;
      setCanPrev(first.getBoundingClientRect().left < origin + 16);
      setCanNext(last.getBoundingClientRect().left > origin + 40);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [notes.length, showUpcoming]);

  const scrollByCard = (direction: 1 | -1) => {
    const root = scrollerRef.current;
    const card = root?.querySelector("[data-notas-card]");
    if (!root || !(card instanceof HTMLElement)) return;

    root.scrollBy({
      left: direction * (card.getBoundingClientRect().width + 12),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section
      ref={panelRef}
      aria-labelledby="notas-home-title"
      className="notas-home-panel"
    >
      <header
        ref={introRef}
        className="border-paper bg-canvas text-paper border-b"
      >
        <div className="page-shell flex min-w-0 flex-col gap-4 py-4 md:flex-row md:items-end md:justify-between md:gap-10 md:py-5">
          <div className="min-w-0">
            <NotaShared name={notasIndexTitleName} share="text-morph">
              <h2
                id="notas-home-title"
                className="w-full max-w-4xl min-w-0 text-[clamp(1.7rem,5vw,2.85rem)] leading-[0.86] font-normal tracking-[-0.065em] italic"
              >
                Notas de cordada
              </h2>
            </NotaShared>
            <p className="mt-3 max-w-xl text-sm leading-snug md:text-base">
              Apuntes personales sobre las decisiones que se toman antes,
              durante y después de un largo. Sigue estos consejos bajo tu propio
              riesgo.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-x-8 gap-y-2">
            <Link
              href="/notas-de-cordada"
              prefetch
              className="focus-visible:outline-paper text-[0.68rem] tracking-[0.16em] uppercase hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              Ver todas ↗
            </Link>
            <div className="hidden gap-8 md:flex">
              <button
                type="button"
                aria-controls="notas-home-track"
                aria-label="Nota anterior"
                disabled={!canPrev}
                onClick={() => scrollByCard(-1)}
                className="focus-visible:outline-paper text-[0.68rem] tracking-[0.16em] uppercase hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:no-underline disabled:opacity-25"
              >
                Anterior
              </button>
              <button
                type="button"
                aria-controls="notas-home-track"
                aria-label="Nota siguiente"
                disabled={!canNext}
                onClick={() => scrollByCard(1)}
                className="focus-visible:outline-paper text-[0.68rem] tracking-[0.16em] uppercase hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:no-underline disabled:opacity-25"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-beige min-h-0">
        <ul
          ref={scrollerRef}
          id="notas-home-track"
          aria-label="Notas de cordada"
          className="notas-home-track page-shell flex h-full min-h-0 snap-x snap-mandatory scroll-px-5 items-stretch gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain py-4 md:scroll-px-8 md:py-5"
        >
          {notes.map((note, index) => (
            <li key={note.slug} data-notas-card className={cardClass}>
              <NoteCard note={note} index={index} />
            </li>
          ))}
          {showUpcoming ? (
            <li data-notas-card className={cardClass}>
              <UpcomingCard />
            </li>
          ) : null}
          <li aria-hidden="true" className="w-3 shrink-0 md:w-[10%]" />
        </ul>
      </div>
    </section>
  );
}

function NoteCard({ note, index }: { note: HomeNote; index: number }) {
  return (
    <Link
      href={`/notas-de-cordada/${note.slug}`}
      prefetch
      className="group border-ink bg-paper focus-visible:outline-ink grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] border focus-visible:outline-2 focus-visible:outline-offset-4 md:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] md:grid-rows-none"
    >
      <div className="bg-canvas relative min-h-0">
        {note.cover ? (
          <NotaShared name={notaCoverName(note.slug)} share="nota-morph">
            <div className="absolute inset-0">
              <Image
                src={note.cover.src}
                alt={note.cover.alt}
                fill
                sizes="(max-width: 767px) 92vw, 55vw"
                className={`object-cover ${note.cover.object}`}
              />
            </div>
          </NotaShared>
        ) : null}
      </div>
      <div className="border-ink flex flex-col justify-between gap-6 border-t p-5 md:border-t-0 md:border-l md:p-8 lg:p-10">
        <div>
          <p className="text-[0.65rem] tracking-[0.18em] uppercase">
            {String(index + 1).padStart(2, "0")}
          </p>
          <NotaShared name={notaTitleName(note.slug)} share="text-morph">
            <h3 className="mt-4 w-full min-w-0 text-[clamp(1.7rem,4.4vw,3.4rem)] leading-[0.92] tracking-[-0.05em] italic md:mt-6">
              {note.title}
            </h3>
          </NotaShared>
        </div>
        <span className="text-[0.68rem] tracking-[0.16em] uppercase group-hover:underline group-focus-visible:underline">
          Ir a la nota ↗
        </span>
      </div>
    </Link>
  );
}

function UpcomingCard() {
  return (
    <div className="border-ink bg-beige flex h-full min-h-0 items-end border p-5 md:p-8">
      <p className="text-[0.68rem] tracking-[0.18em] uppercase">Próximamente</p>
    </div>
  );
}
