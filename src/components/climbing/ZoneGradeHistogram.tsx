import type { gradeHistogram } from "@/lib/climbing/gradeHistogram";

type Histogram = ReturnType<typeof gradeHistogram>;

export default function ZoneGradeHistogram({
  histogram,
}: {
  histogram: Histogram;
}) {
  if (histogram.total === 0) return null;

  return (
    <div>
      <p className="kicker">Grados</p>
      <h2 className="font-display mt-2 text-3xl">Por grado</h2>
      <p className="font-brown text-ink-soft mt-2 text-sm">
        {histogram.total}{" "}
        {histogram.total === 1 ? "vía" : "vías"} de 5to a 8vo
      </p>
      <ul className="mt-8 space-y-4">
        {histogram.bands.map((band) => (
          <li key={band.key}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-brown text-sm tracking-[0.08em] uppercase">
                {band.label}
              </span>
              <span className="font-brown text-ink-soft text-sm tabular-nums">
                {band.count}
              </span>
            </div>
            <div
              className="bg-beige mt-2 h-2 w-full"
              role="meter"
              aria-label={`${band.label}: ${band.count} ${band.count === 1 ? "vía" : "vías"}`}
              aria-valuemin={0}
              aria-valuemax={histogram.total}
              aria-valuenow={band.count}
            >
              <div
                className="bg-signal h-2"
                style={{ width: `${Math.round(band.ratio * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
