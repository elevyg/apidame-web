"use client";

import { useState } from "react";
import type { CloudinaryImage } from "@/lib/climbing/cloudinary";

type AdminPhotoFieldProps = {
  currentUrl?: string | null;
  currentAlt: string;
  library: CloudinaryImage[];
  required?: boolean;
};

function cloudinarySized(url: string, publicId: string | null | undefined, width: number) {
  if (!publicId) return url;
  if (url.includes("/image/upload/")) {
    return url.replace("/image/upload/", `/image/upload/w_${width},c_limit,q_auto,f_auto/`);
  }
  return url;
}

export default function AdminPhotoField({
  currentUrl,
  currentAlt,
  library,
  required = false,
}: AdminPhotoFieldProps) {
  const [preview, setPreview] = useState(currentUrl ?? "");
  const [picked, setPicked] = useState("");

  return (
    <div className="grid gap-3">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt={currentAlt}
          className="border-rule h-40 w-full border object-cover"
        />
      ) : null}
      <label className="font-brown text-sm">
        Foto
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          required={required && !picked && !currentUrl}
          onChange={(event) => {
            const file = event.target.files?.[0];
            setPicked("");
            setPreview(file ? URL.createObjectURL(file) : (currentUrl ?? ""));
          }}
          className="border-rule mt-1 block w-full border px-3 py-2"
        />
      </label>
      {library.length > 0 ? (
        <fieldset>
          <legend className="font-brown text-ink-soft text-xs tracking-[0.14em] uppercase">
            O elegir una que ya está
          </legend>
          <ul className="border-rule mt-2 grid max-h-48 grid-cols-6 gap-1 overflow-y-auto border p-1 sm:grid-cols-8">
            {library.map((image) => (
              <li key={image.publicId}>
                <label className="block cursor-pointer">
                  <input
                    type="radio"
                    name="existingPublicId"
                    value={image.publicId}
                    checked={picked === image.publicId}
                    onChange={() => {
                      setPicked(image.publicId);
                      setPreview(
                        cloudinarySized(image.url, image.publicId, 1200),
                      );
                    }}
                    className="sr-only"
                  />
                  {picked === image.publicId ? (
                    <>
                      <input type="hidden" name="existingWidth" value={image.width ?? ""} />
                      <input type="hidden" name="existingHeight" value={image.height ?? ""} />
                    </>
                  ) : null}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cloudinarySized(image.url, image.publicId, 240)}
                    alt=""
                    className={`bg-paper-deep pointer-events-none aspect-square w-full object-contain ${
                      picked === image.publicId
                        ? "outline-ink outline outline-2 outline-offset-1"
                        : ""
                    }`}
                  />
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ) : null}
    </div>
  );
}
