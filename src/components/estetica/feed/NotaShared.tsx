"use client";

import { ViewTransition } from "react";
import type { ReactNode } from "react";

export function NotaShared({
  name,
  share,
  children,
}: {
  name: string;
  share: "nota-morph" | "text-morph";
  children: ReactNode;
}) {
  return (
    <ViewTransition name={name} share={share} default="none">
      {children}
    </ViewTransition>
  );
}
