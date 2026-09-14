import type { ReactNode } from "react";

type NoticeProps = {
  kicker: string;
  children: ReactNode;
};

export default function Notice({ kicker, children }: NoticeProps) {
  return (
    <aside className="border border-rule bg-paper-deep px-5 py-4">
      <p className="kicker mb-2">{kicker}</p>
      <div className="font-brown text-sm leading-relaxed text-ink">
        {children}
      </div>
    </aside>
  );
}
