import type { ReactNode } from "react";

type HomePanelProps = {
  hero?: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
  as?: "section" | "div";
};

export default function HomePanel({
  hero = false,
  id,
  className = "",
  children,
  as: Tag = "section",
}: HomePanelProps) {
  return (
    <Tag
      id={id}
      {...(hero ? { "data-home-hero": "" } : {})}
      className={
        hero
          ? `h-dvh ${className}`
          : `flex min-h-dvh flex-col pt-[var(--site-header-h)] ${className}`
      }
    >
      {children}
    </Tag>
  );
}
