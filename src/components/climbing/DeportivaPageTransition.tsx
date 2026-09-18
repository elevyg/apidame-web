"use client";

import { ViewTransition } from "react";
import type { ReactNode } from "react";

const direction = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
} as const;

export default function DeportivaPageTransition({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ViewTransition enter={direction} exit={direction} default="none">
      <div className="flex min-h-full flex-1 flex-col">{children}</div>
    </ViewTransition>
  );
}
