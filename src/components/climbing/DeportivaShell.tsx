"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";

export default function DeportivaShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ block: "start" });
        return;
      }
    }
    scroller.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="shrink-0">
        <SiteHeader current="deportiva" pinned />
      </div>
      <div
        ref={scrollerRef}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto"
      >
        {children}
      </div>
    </div>
  );
}
