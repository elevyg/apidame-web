const CLOUDINARY_HOST = "res.cloudinary.com";
const CLOUD_NAME = "fundacion-andescalada";

export function optimizedImageUrl(
  image: { url: string; publicId?: string | null },
  width = 1600,
): string {
  if (!image.publicId) return image.url;
  return `https://${CLOUDINARY_HOST}/${CLOUD_NAME}/image/upload/w_${width},c_limit,q_auto,f_auto/${image.publicId}`;
}

export function pdfImageUrl(
  image: { url: string; publicId?: string | null },
): string {
  if (!image.publicId) return image.url;
  return `https://${CLOUDINARY_HOST}/${CLOUD_NAME}/image/upload/w_1200,c_limit,q_70,f_jpg/${image.publicId}.jpg`;
}
