"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import posthog from "posthog-js";

type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

type TrackedLinkProps = {
  href: string;
  event: string;
  properties?: AnalyticsProperties;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  transitionTypes?: string[];
};

export default function TrackedLink({
  href,
  event,
  properties,
  children,
  className,
  target,
  rel,
  onClick,
  transitionTypes,
}: TrackedLinkProps) {
  const handleClick = () => {
    posthog.capture(event, { href, ...properties });
    onClick?.();
  };

  const external =
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("//");

  if (external) {
    return (
      <a
        href={href}
        className={className}
        target={target}
        rel={rel}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      transitionTypes={transitionTypes}
    >
      {children}
    </Link>
  );
}
