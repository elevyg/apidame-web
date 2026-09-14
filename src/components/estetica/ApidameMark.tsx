import Logo from "assets/svgs/icon-solo.svg";

type ApidameMarkProps = {
  tone?: "ink" | "paper";
};

export default function ApidameMark({ tone = "ink" }: ApidameMarkProps) {
  const fill = tone === "paper" ? "fill-paper" : "fill-ink";
  const text = tone === "paper" ? "text-paper" : "text-ink";

  return (
    <div className="flex items-center gap-3">
      <Logo
        height={28}
        width={30}
        className={`h-6 w-6 md:h-7 md:w-7 ${fill}`}
        aria-hidden
      />
      <span
        className={`font-brand text-[11px] tracking-[0.34em] md:text-sm ${text}`}
      >
        APIDAME
      </span>
    </div>
  );
}
