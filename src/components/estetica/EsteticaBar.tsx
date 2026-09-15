"use client";

import { motion } from "framer-motion";
import SiteHeader from "@/components/SiteHeader";

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
      <motion.div
        initial={false}
        animate={{ y: visible ? 0 : "-100%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <SiteHeader pinned local markHref="#muro" />
      </motion.div>
    </div>
  );
}
