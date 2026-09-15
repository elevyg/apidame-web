"use client";

import Image from "next/image";
import Link from "next/link";
import { forwardRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Logo from "assets/svgs/icon-solo.svg";
import { siteNav } from "@/components/siteNav";

const ease = [0.22, 1, 0.36, 1] as const;
const HOLD_MS = 7200;
const FADE_S = 3.2;

const plates = [
  {
    src: "/estetica/presentacion/proa-aerea.jpg",
    alt: "Cerro Apidame, Proa",
    object: "object-[50%_42%]",
  },
  {
    src: "/estetica/muro/galpon-nieve-b.jpg",
    alt: "El galpón del muro en Chile Chico",
    object: "object-[50%_38%]",
  },
] as const;

type EsteticaHeroProps = {
  lab?: boolean;
};

const EsteticaHero = forwardRef<HTMLElement, EsteticaHeroProps>(
  function EsteticaHero({ lab = false }, ref) {
    const reduce = useReducedMotion();
    const [index, setIndex] = useState(0);

    useEffect(() => {
      if (reduce) return;
      const id = window.setInterval(() => {
        setIndex((current) => (current + 1) % plates.length);
      }, HOLD_MS);
      return () => window.clearInterval(id);
    }, [reduce]);

    return (
      <section
        ref={ref}
        className="relative flex h-full min-h-0 flex-col overflow-hidden bg-ink text-paper"
      >
        <div className="absolute inset-0 bg-ink">
          {plates.map((plate, i) => {
            const on = reduce ? i === 0 : i === index;
            return (
              <motion.div
                key={plate.src}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: on ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : FADE_S, ease }}
                style={{ mixBlendMode: "plus-lighter" }}
              >
                <motion.div
                  key={`${plate.src}-${on ? "on" : "off"}`}
                  className="absolute inset-0"
                  initial={{ scale: 1 }}
                  animate={{ scale: reduce || !on ? 1 : 1.06 }}
                  transition={{
                    duration: reduce || !on ? 0 : HOLD_MS / 1000,
                    ease: "linear",
                  }}
                >
                  <Image
                    src={plate.src}
                    alt=""
                    fill
                    priority={i === 0}
                    quality={85}
                    sizes="100vw"
                    className={`object-cover ${plate.object}`}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/15 to-ink/35" />

        {lab ? (
          <p className="absolute top-5 left-5 z-10 font-brown text-[10px] tracking-[0.16em] text-paper/70 uppercase md:top-8 md:left-10">
            <Link href="/" className="hover:text-paper">
              Sitio
            </Link>
            {" · "}
            <a href="#notas" className="hover:text-paper">
              Notas
            </a>
          </p>
        ) : null}

        <nav className="absolute top-5 right-5 z-10 flex flex-col items-end md:top-8 md:right-16 lg:right-24">
          {siteNav.map((item) => {
            const className =
              "border-r border-paper/40 py-2.5 pr-3 font-brown text-[11px] tracking-[0.2em] text-paper/85 uppercase [text-shadow:0_1px_16px_rgba(0,0,0,0.45)] hover:text-paper md:text-xs";
            if (item.homeHref.startsWith("/")) {
              return (
                <Link key={item.id} href={item.homeHref} className={className}>
                  {item.label}
                </Link>
              );
            }
            return (
              <a key={item.id} href={item.homeHref} className={className}>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="relative z-10 mt-auto px-5 pb-8 md:px-16 md:pb-12 lg:px-24">
          <Logo
            height={96}
            width={103}
            className="h-14 w-14 fill-paper md:h-20 md:w-20"
            aria-hidden
          />
          <h1 className="font-brand mt-6 max-w-full text-[clamp(2.75rem,12vw,8.5rem)] leading-none tracking-[0.12em] md:mt-8">
            APIDAME
          </h1>
          <p className="mt-6 font-brown text-[11px] tracking-[0.22em] text-paper/70 uppercase md:mt-8">
            Chile Chico · desde 2021
          </p>
        </div>
      </section>
    );
  },
);

export default EsteticaHero;
