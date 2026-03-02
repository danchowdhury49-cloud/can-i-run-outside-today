import type { RegionSummary } from "@/lib/weather-types";
import type { RunAdvice } from "@/lib/advice";

type Props = {
  summary: RegionSummary | null;
  advice: RunAdvice | null;
  sessionType?: "Easy" | "Tempo" | "Intervals" | "Long";
};

export function RunPanel({ summary, advice, sessionType = "Easy" }: Props) {
  if (!summary || !advice) {
    return (
      <div className="rounded-2xl border border-sky-200 bg-white/60 p-4 shadow-sm">
        <div className="h-4 w-32 animate-pulse rounded bg-skysoft" />
        <div className="mt-3 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-skysoft" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-skysoft" />
          <div className="h-3 w-4/6 animate-pulse rounded bg-skysoft" />
        </div>
      </div>
    );
  }

  const scoreColour =
    advice.score >= 80
      ? "bg-emerald-100 text-emerald-800"
      : advice.score >= 60
      ? "bg-skysoft text-primary"
      : advice.score >= 40
      ? "bg-amber-100 text-amber-800"
      : "bg-rose-100 text-rose-800";

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-sky-200 bg-white/80 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
              Run readiness
            </span>
            <span className="rounded-full bg-skysoft px-2 py-0.5 text-[11px] font-medium text-slate-700">
              Session: {sessionType}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-slate-900">
              {advice.score}
            </span>
            <span className="rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-700">
              {advice.label}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Snapshot for the selected hour across regional sample points.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 text-right text-xs">
          <span className={`rounded-full px-2 py-0.5 ${scoreColour}`}>
            Score out of 100
          </span>
          <span className="text-[11px] text-slate-500">
            Temp {summary.temperatureMean.toFixed(1)}°C feels like{" "}
            {summary.apparentTemperatureMean.toFixed(1)}°C
          </span>
          <span className="text-[11px] text-slate-500">
            Rain {summary.precipitationProbabilityMean.toFixed(0)}% &middot;{" "}
            {summary.precipitationMean.toFixed(1)}mm &middot; Gusts{" "}
            {summary.windgustsMean.toFixed(0)} km/h
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-skysoft px-3 py-2 text-xs text-slate-700">
        {advice.vibeLine}
      </div>

      <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
        <div>
          <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            Reasons
          </h3>
          <ul className="space-y-1">
            {advice.reasons.map((r) => (
              <li key={r} className="flex gap-2">
                <span className="mt-[2px] text-slate-400">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            Clothing
          </h3>
          <ul className="space-y-1">
            {advice.clothing.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="mt-[2px] text-slate-400">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            Shoes
          </h3>
          <ul className="space-y-1">
            {advice.shoes.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="mt-[2px] text-slate-400">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            Hydration &amp; fuel
          </h3>
          <ul className="space-y-1">
            {advice.fuelHydration.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="mt-[2px] text-slate-400">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

