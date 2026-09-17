"use client";

import { useRef, useState } from "react";
import posthog from "posthog-js";

type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

type DownloadPdfLinkProps = {
  href: string;
  event: string;
  properties?: AnalyticsProperties;
  children: string;
  className?: string;
};

function filenameFromDisposition(header: string | null, fallback: string) {
  const quoted = header?.match(/filename="([^"]+)"/i)?.[1];
  if (quoted) return quoted;
  const plain = header?.match(/filename=([^;]+)/i)?.[1]?.trim();
  return plain || fallback;
}

export default function DownloadPdfLink({
  href,
  event,
  properties,
  children,
  className,
}: DownloadPdfLinkProps) {
  const [status, setStatus] = useState<"idle" | "pending" | "error">("idle");
  const requestRef = useRef(0);

  async function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (status === "pending") return;

    posthog.capture(event, { href, ...properties });
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    setStatus("pending");

    try {
      const response = await fetch(href, { cache: "no-store" });
      if (!response.ok) throw new Error("pdf_failed");
      const blob = await response.blob();
      if (requestRef.current !== requestId) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filenameFromDisposition(
        response.headers.get("Content-Disposition"),
        "guia.pdf",
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus("idle");
    } catch {
      if (requestRef.current !== requestId) return;
      setStatus("error");
      window.setTimeout(() => {
        if (requestRef.current === requestId) setStatus("idle");
      }, 2500);
    }
  }

  const label =
    status === "pending"
      ? "Descargando…"
      : status === "error"
        ? "No se pudo descargar"
        : children;

  return (
    <span className="block">
      <a
        href={href}
        className={`${className ?? ""} ${
          status === "pending" ? "pointer-events-none cursor-wait" : ""
        }`.trim()}
        aria-busy={status === "pending"}
        aria-live="polite"
        onClick={handleClick}
      >
        {label}
      </a>
      {status === "pending" ? (
        <span className="font-brown text-ink-soft mt-1 block text-xs tracking-[0.08em] uppercase">
          Puede tardar unos segundos
        </span>
      ) : null}
    </span>
  );
}
