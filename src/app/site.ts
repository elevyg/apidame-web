export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  "https://apidameboulder.com";

export const siteName = "Apidame";

export const siteTitle =
  "Apidame | Gimnasio y escuela de escalada en Chile Chico";

export const siteDescription =
  "Apidame es el gimnasio y escuela de escalada de Chile Chico, Aysén. Información del muro, topos del Cerro Apidame y sectores de escalada deportiva.";

export const siteOgAlt =
  "Apidame, gimnasio y escuela de escalada en Chile Chico";

export const siteOgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: siteOgAlt,
} as const;
