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
      className={pending ? `${className ?? ""} animate-pulse` : className}
      aria-live="polite"
    >
      {pending ? pendingLabel : children}
    </span>
  );
}
