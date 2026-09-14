"use client";

import { useEffect } from "react";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-4">
      <div className="flex h-full max-h-[680px] w-full max-w-4xl flex-col border border-rule bg-paper">
        <div className="flex items-center justify-between border-b border-rule px-5 py-4">
          <h3 className="font-display text-xl">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="font-brown text-xs tracking-[0.16em] uppercase text-ink-soft hover:text-ink"
          >
            Cerrar
          </button>
        </div>
        <div className="relative flex-1 bg-paper-deep">
          <iframe
            src={previewUrl}
            title={`Vista previa ${title}`}
            className="absolute inset-0 h-full w-full border-none"
          />
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-rule px-5 py-3 font-brown text-xs text-ink-soft">
          <span>Si no carga, ábrelo en una pestaña nueva.</span>
          <a
            href={openUrl}
            target="_blank"
            rel="noreferrer"
            className="text-ink underline decoration-from-font underline-offset-4"
          >
            Abrir PDF
          </a>
        </div>
      </div>
    </div>
  );
}
