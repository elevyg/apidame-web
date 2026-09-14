"use client";

import { motion } from "framer-motion";
import ApidameMark from "@/components/estetica/ApidameMark";
import { esteticaLinks } from "@/components/estetica/esteticaLinks";

type EsteticaBarProps = {
  visible: boolean;
};

export default function EsteticaBar({ visible }: EsteticaBarProps) {
  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 ${visible ? "" : "pointer-events-none"}`}
      aria-hidden={!visible}
      {...(visible ? {} : { inert: true })}
    >
      <motion.header
        initial={false}
        animate={{ y: visible ? 0 : "-100%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="border-b border-rule bg-paper"
      >
        <div className="flex h-12 items-center justify-between gap-4 px-5 md:h-14 md:px-16 lg:px-24">
          <a href="#muro" className="shrink-0">
            <ApidameMark />
          </a>
          <nav className="flex items-center gap-4 overflow-x-auto md:gap-7">
            {esteticaLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-brown text-[10px] tracking-[0.16em] text-ink-soft uppercase whitespace-nowrap hover:text-ink md:text-[11px]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </motion.header>
    </div>
  );
}
