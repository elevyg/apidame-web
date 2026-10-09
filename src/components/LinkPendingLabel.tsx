"use client";

import { useLinkStatus } from "next/link";
import type { ReactNode } from "react";

type LinkPendingLabelProps = {
  children: ReactNode;
  pendingLabel: ReactNode;
  className?: string;
};

export default function LinkPendingLabel({
  children,
  pendingLabel,
  className,
}: LinkPendingLabelProps) {
  const { pending } = useLinkStatus();
  return (
    <span
      className={`${className ?? ""} ${pending ? "animate-pulse" : ""}`}
      aria-live="polite"
    >
      {pending ? pendingLabel : children}
    </span>
  );
}
