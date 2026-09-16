export type SiteNavId =
  | "muro"
  | "cerro"
  | "deportiva"
  | "quienes-somos"
  | "notas-de-cordada";

type SiteNavItem = {
  id: SiteNavId;
  label: string;
  homeHref: string;
  href: string;
};

export const siteNav: readonly SiteNavItem[] = [
  { id: "muro" as const, label: "Muro", homeHref: "#muro", href: "/#muro" },
  { id: "cerro" as const, label: "Cerro", homeHref: "/topos", href: "/topos" },
  {
    id: "deportiva" as const,
    label: "Deportiva",
    homeHref: "/deportiva",
    href: "/deportiva",
  },
  {
    id: "quienes-somos" as const,
    label: "Quiénes somos",
    homeHref: "/quienes-somos",
    href: "/quienes-somos",
  },
  {
    id: "notas-de-cordada",
    label: "Notas de cordada",
    homeHref: "/notas-de-cordada",
    href: "/notas-de-cordada",
  },
];
