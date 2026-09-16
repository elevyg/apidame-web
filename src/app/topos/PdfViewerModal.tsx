"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

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
        <div className="bg-paper-deep relative flex-1">
          <iframe
            src={previewUrl}
            title={`Vista previa ${title}`}
            className="absolute inset-0 h-full w-full border-none"
          />
        </div>
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
