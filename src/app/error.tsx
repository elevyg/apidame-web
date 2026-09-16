"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function Error({
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
    <main className="page-shell py-16">
      <p className="kicker">Error</p>
      <h1 className="font-display mt-3 text-4xl">Algo se rompió</h1>
      <p className="font-brown text-ink-soft mt-4">Puedes intentar de nuevo.</p>
      <button
        type="button"
        onClick={reset}
        className="font-brown mt-8 text-sm tracking-[0.16em] uppercase underline decoration-from-font underline-offset-4"
      >
        Reintentar
      </button>
    </main>
  );
}
