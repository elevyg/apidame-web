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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="y2k-panel y2k-noise flex h-full max-h-[680px] w-full max-w-4xl flex-col">
        <div className="flex items-center justify-between border-b-2 border-secondaryA/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-secondaryA/70" />
            <span className="h-2 w-2 rounded-full bg-secondaryB/70" />
            <h3 className="font-forgen text-lg text-primaryB">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-secondaryA/60 px-3 py-1 text-xs font-brown text-secondaryA hover:border-secondaryB hover:text-secondaryB"
          >
            Cerrar
          </button>
        </div>
        <div className="relative flex-1 bg-black/40">
          <iframe
            src={previewUrl}
            title={`Vista previa ${title}`}
            className="absolute inset-0 h-full w-full border-none"
          />
        </div>
        <div className="flex items-center justify-between border-t-2 border-secondaryA/30 px-4 py-3 text-xs font-brown text-primaryB/60">
          <span>Si no carga, ábrelo en una nueva pestaña.</span>
          <a
            href={openUrl}
            target="_blank"
            rel="noreferrer"
            className="text-secondaryA hover:text-secondaryB"
          >
            Abrir en nueva pestaña →
          </a>
        </div>
      </div>
    </div>
  );
}
