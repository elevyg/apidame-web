"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    posthog.captureException(error);
  }, [error]);

  return (
    <html lang="es-CL">
      <body className="bg-paper text-ink antialiased">
        <main className="px-6 py-16">
          <p className="text-xs tracking-[0.18em] uppercase">Error</p>
          <h1 className="mt-3 text-4xl">Algo se rompió</h1>
          <p className="font-brown text-ink-soft mt-4">
            Puedes intentar de nuevo.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 text-sm tracking-[0.16em] uppercase underline"
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}
