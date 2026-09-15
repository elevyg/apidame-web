export type SiteNavId =
  | "muro"
  | "cerro"
  | "deportiva"
  | "topos"
  | "quienes-somos";

export const siteNav = [
  { id: "muro" as const, label: "Muro", homeHref: "#muro", href: "/#muro" },
  { id: "cerro" as const, label: "Cerro", homeHref: "#cerro", href: "/#cerro" },
  {
    id: "deportiva" as const,
    label: "Deportiva",
    homeHref: "#deportiva",
    href: "/#deportiva",
  },
  { id: "topos" as const, label: "Topos", homeHref: "/topos", href: "/topos" },
  {
    id: "quienes-somos" as const,
    label: "Quiénes somos",
    homeHref: "/quienes-somos",
    href: "/quienes-somos",
  },
];
