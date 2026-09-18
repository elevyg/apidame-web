import { createHash } from "node:crypto";

const CLOUDINARY_HOST = "res.cloudinary.com";
const DEFAULT_CLOUD_NAME = "fundacion-andescalada";
const GUIDE_FOLDER = "apidame/guia";

export function cloudinaryCloudName() {
  return process.env.CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;
}

export function signCloudinaryParams(
  params: Record<string, string | number>,
  apiSecret: string,
) {
  const toSign = Object.entries(params)
    .filter(([key]) => !["file", "cloud_name", "resource_type", "api_key"].includes(key))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");
}

export function optimizedImageUrl(
  image: { url: string; publicId?: string | null },
  width = 1600,
): string {
  if (!image.publicId) return image.url;
  return `https://${CLOUDINARY_HOST}/${cloudinaryCloudName()}/image/upload/w_${width},c_limit,q_auto,f_auto/${image.publicId}`;
}

export function pdfImageUrl(
  image: { url: string; publicId?: string | null },
): string {
  if (!image.publicId) return image.url;
  return `https://${CLOUDINARY_HOST}/${cloudinaryCloudName()}/image/upload/w_1200,c_limit,q_70,f_jpg/${image.publicId}.jpg`;
}

export function cloudinaryDeliveryUrl(publicId: string) {
  return `https://${CLOUDINARY_HOST}/${cloudinaryCloudName()}/image/upload/${publicId}`;
}

export type CloudinaryImage = {
  url: string;
  publicId: string;
  width: number | null;
  height: number | null;
};

function cloudinaryAuth() {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) {
    throw new Error("Falta Cloudinary en el entorno");
  }
  return { apiKey, apiSecret };
}

export async function uploadGuideImage(
  file: File,
  folder = `${GUIDE_FOLDER}/topos`,
): Promise<CloudinaryImage> {
  if (file.size <= 0) throw new Error("La foto está vacía");
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("La foto pesa más de 12 MB");
  }
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/heic"];
  if (file.type && !allowed.includes(file.type)) {
    throw new Error("Usa JPG, PNG o WebP");
  }

  const { apiKey, apiSecret } = cloudinaryAuth();
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signCloudinaryParams({ folder, timestamp }, apiSecret);
  const body = new FormData();
  body.set("file", file);
  body.set("api_key", apiKey);
  body.set("timestamp", String(timestamp));
  body.set("folder", folder);
  body.set("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryCloudName()}/image/upload`,
    { method: "POST", body },
  );
  if (!response.ok) {
    throw new Error("No se pudo subir la foto");
  }
  const payload = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
    width?: number;
    height?: number;
  };
  if (!payload.secure_url || !payload.public_id) {
    throw new Error("Cloudinary no devolvió la foto");
  }
  return {
    url: payload.secure_url,
    publicId: payload.public_id,
    width: payload.width ?? null,
    height: payload.height ?? null,
  };
}

export async function listGuideImagesOrEmpty(prefix?: string) {
  try {
    return await listGuideImages(prefix);
  } catch {
    return [];
  }
}

export async function listGuideImages(
  prefix?: string,
): Promise<CloudinaryImage[]> {
  const { apiKey, apiSecret } = cloudinaryAuth();
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const url = new URL(
    `https://api.cloudinary.com/v1_1/${cloudinaryCloudName()}/resources/image/upload`,
  );
  if (prefix) url.searchParams.set("prefix", prefix);
  url.searchParams.set("max_results", "48");
  const response = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("No se pudieron listar las fotos");
  }
  const payload = (await response.json()) as {
    resources?: Array<{
      public_id: string;
      secure_url: string;
      width?: number;
      height?: number;
    }>;
  };
  return (payload.resources ?? []).map((resource) => ({
    url: resource.secure_url,
    publicId: resource.public_id,
    width: resource.width ?? null,
    height: resource.height ?? null,
  }));
}

export async function imageFromAdminForm(
  formData: FormData,
  folder: string,
): Promise<CloudinaryImage | null> {
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    return uploadGuideImage(file, folder);
  }
  const existingPublicId = String(formData.get("existingPublicId") ?? "").trim();
  if (existingPublicId) {
    const width = Number(formData.get("existingWidth") ?? 0);
    const height = Number(formData.get("existingHeight") ?? 0);
    return {
      url: cloudinaryDeliveryUrl(existingPublicId),
      publicId: existingPublicId,
      width: Number.isFinite(width) && width > 0 ? width : null,
      height: Number.isFinite(height) && height > 0 ? height : null,
    };
  }
  return null;
}
