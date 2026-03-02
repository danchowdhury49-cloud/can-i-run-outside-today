import type { BestWindow } from "@/lib/weather-types";

type Props = {
  window: BestWindow | null;
};

function describeWindow(window: BestWindow | null): string {
  if (!window) return "We couldn't pick a clear winner. Consider a flexible easy run window.";
  if (window.averageScore >= 80) return "Goldilocks slot: ideal for most sessions, even some spicy ones.";
  if (window.averageScore >= 60) return "Solid window for easy or steady miles.";
  if (window.averageScore >= 40) return "Usable, but expect some weather-induced character building.";
  return "Technically runnable, spiritually questionable. Maybe cross-train?";
}

function formatOffset(offset: number): string {
  const now = new Date();
  const target = new Date(now.getTime() + offset * 60 * 60 * 1000);
  const h = target.getHours().toString().padStart(2, "0");
  return `${h}:00`;
}

export function BestWindowCard({ window }: Props) {
  return (
    <section className="rounded-2xl border border-sky-200 bg-white/80 p-3 text-sm shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
          Best run window
        </span>
        <span className="text-xs text-slate-500">next 24 hours</span>
      </div>
      {window ? (
        <>
          <div className="text-sm font-semibold text-slate-900">
            {formatOffset(window.startOffset)} – {formatOffset(window.endOffset)}{" "}
            <span className="ml-1 rounded-full bg-skysoft px-2 py-0.5 text-xs font-medium text-primary">
              Score ~{window.averageScore}/100
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-600">{describeWindow(window)}</p>
        </>
      ) : (
        <p className="text-xs text-slate-600">
          Not enough data for a confident pick. When in doubt, keep it easy and short.
        </p>
      )}
    </section>
  );
}

