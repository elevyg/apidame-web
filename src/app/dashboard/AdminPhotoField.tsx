"use client";

import { useState } from "react";
import type { CloudinaryImage } from "@/lib/climbing/cloudinary";

type AdminPhotoFieldProps = {
  currentUrl?: string | null;
  currentAlt: string;
  library: CloudinaryImage[];
  required?: boolean;
};

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
          className="border-rule h-48 w-full border object-cover"
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
          <ul className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-4">
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
                      setPreview(image.url);
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
                    src={image.url}
                    alt=""
                    className={`border-rule h-20 w-full border object-cover ${
                      picked === image.publicId ? "outline outline-2 outline-offset-2" : ""
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
