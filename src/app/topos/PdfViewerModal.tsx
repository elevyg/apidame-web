"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";

const PREVIEW_TIMEOUT_MS = 10000;

type PdfViewerModalProps = {
  isOpen: boolean;
  title: string;
  fileId: string;
  onClose: () => void;
};

export default function PdfViewerModal({
  isOpen,
  title,
  fileId,
  onClose,
}: PdfViewerModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const openUrl = `https://drive.google.com/file/d/${fileId}/view`;

  return (
    <div className="bg-ink/70 fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="border-rule bg-paper flex h-full max-h-[680px] w-full max-w-4xl flex-col border">
        <div className="border-rule flex items-center justify-between border-b px-5 py-4">
          <h3 className="font-display text-xl">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="font-brown text-ink-soft hover:text-ink text-xs tracking-[0.16em] uppercase"
          >
            Cerrar
          </button>
        </div>
        <PdfPreview
          key={fileId}
          title={title}
          fileId={fileId}
          previewUrl={previewUrl}
          openUrl={openUrl}
        />
        <div className="border-rule font-brown text-ink-soft flex items-center justify-between gap-4 border-t px-5 py-3 text-xs">
          <span>Si no carga, ábrelo en una pestaña nueva.</span>
          <a
            href={openUrl}
            target="_blank"
            rel="noreferrer"
            className="text-ink underline decoration-from-font underline-offset-4"
            onClick={() => {
              posthog.capture("topo_pdf_external_opened", {
                title,
                file_id: fileId,
                source: "footer",
              });
            }}
          >
            Abrir PDF
          </a>
        </div>
      </div>
    </div>
  );
}

type PdfPreviewProps = {
  title: string;
  fileId: string;
  previewUrl: string;
  openUrl: string;
};

function PdfPreview({ title, fileId, previewUrl, openUrl }: PdfPreviewProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "timeout">(
    "loading",
  );
  const openedAtRef = useRef(0);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    openedAtRef.current = performance.now();
    timeoutRef.current = window.setTimeout(() => {
      setStatus("timeout");
      posthog.captureException(
        new Error("Google Drive PDF preview did not load in time"),
        { title, file_id: fileId, timeout_ms: PREVIEW_TIMEOUT_MS },
      );
    }, PREVIEW_TIMEOUT_MS);
    return () => window.clearTimeout(timeoutRef.current);
  }, [title, fileId]);

  const handleLoad = () => {
    window.clearTimeout(timeoutRef.current);
    setStatus("loaded");
    posthog.capture("topo_pdf_preview_loaded", {
      title,
      file_id: fileId,
      load_ms: Math.round(performance.now() - openedAtRef.current),
    });
  };

  return (
    <div className="bg-paper-deep relative flex-1">
      <p className="font-brown text-ink-soft absolute inset-0 flex items-center justify-center p-6 text-center text-xs">
        Cargando vista previa…
      </p>
      <iframe
        src={previewUrl}
        title={`Vista previa ${title}`}
        onLoad={handleLoad}
        className="absolute inset-0 h-full w-full border-none"
      />
      {status === "timeout" ? (
        <div className="bg-paper absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="font-brown text-ink-soft text-sm">
            La vista previa no cargó.
          </p>
          <a
            href={openUrl}
            target="_blank"
            rel="noreferrer"
            className="font-brown bg-ink text-paper px-5 py-3 text-xs tracking-[0.16em] uppercase"
            onClick={() => {
              posthog.capture("topo_pdf_external_opened", {
                title,
                file_id: fileId,
                source: "timeout",
              });
            }}
          >
            Abrir PDF
          </a>
        </div>
      ) : null}
    </div>
  );
}
