import Link from "next/link";

type DeportivaBackLinkProps = {
  href: string;
  to: string;
  compact?: boolean;
};

export default function DeportivaBackLink({
  href,
  to,
  compact = false,
}: DeportivaBackLinkProps) {
  return (
    <Link
      href={href}
      transitionTypes={["nav-back"]}
      aria-label={`Volver a ${to}`}
      className="group font-brown text-ink inline-flex items-center gap-2"
    >
      <span className="border-rule group-hover:bg-beige inline-flex size-10 shrink-0 items-center justify-center border">
        <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
          <path
            d="M10.25 3.25 5.25 8l5 4.75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      </span>
      {compact ? null : (
        <span className="text-xs tracking-[0.14em] uppercase underline decoration-from-font underline-offset-4">
          Volver
        </span>
      )}
    </Link>
  );
}
