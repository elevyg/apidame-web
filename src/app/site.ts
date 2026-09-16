export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  "https://apidameboulder.com";

export const siteName = "Apidame";

export const siteTitle = "Apidame | Escalar, Entrenar, Crear";

export const siteDescription =
  "Apidame en Chile Chico, Aysén. Escalar, entrenar, crear. Información del muro de escalada, topos del Cerro Apidame y sectores de escalada.";

export const siteOgAlt = "Apidame | Escalar, Entrenar, Crear";

export const siteOgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: siteOgAlt,
} as const;
