import Link from "next/link";
import { REGIONS } from "@/lib/regions";
import { getRegionWeather } from "@/lib/weather";
import { buildAdvice } from "@/lib/advice";

export const dynamic = "force-dynamic";

export default async function RegionsPage() {
  const hourOffset = 0;
  const results = await Promise.all(
    REGIONS.map(async (region) => {
      try {
        const data = await getRegionWeather({
          regionSlug: region.slug,
          hourOffset
        });
        const advice = buildAdvice(data.summary);
        return { region, data, advice, error: null as string | null };
      } catch (err) {
        return {
          region,
          data: null,
          advice: null,
          error: "Weather data not available right now."
        };
      }
    })
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Regions</h1>
        <p className="text-sm text-slate-600">
          A quick glance at today&apos;s best windows around the UK. Click a
          region for the full map view.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {results.map(({ region, data, advice, error }) => (
          <Link
            key={region.slug}
            href={`/regions/${region.slug}`}
            className="group rounded-2xl border border-sky-200 bg-white/80 p-3 text-sm shadow-sm transition hover:border-primary hover:shadow-md"
          >
            <div className="mb-1 flex items-center justify-between">
              <div className="font-semibold text-slate-900">
                {region.name}
              </div>
              <span className="rounded-full bg-skysoft px-2 py-0.5 text-[11px] font-medium text-slate-700">
                View details
              </span>
            </div>
            {error || !data || !advice ? (
              <p className="text-xs text-slate-600">
                {error ??
                  "Weather is currently offline for this region. It might be raining on the cables."}
              </p>
            ) : (
              <>
                <div className="mb-1 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    Score {advice.score}/100
                  </span>
                  <span className="rounded-full bg-skysoft px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    {advice.label}
                  </span>
                </div>
                {data.bestWindow && (
                  <div className="text-xs text-slate-700">
                    Best 2‑hour window starts in{" "}
                    <span className="font-semibold">
                      {data.bestWindow.startOffset}h
                    </span>{" "}
                    (score ~{data.bestWindow.averageScore}/100).
                  </div>
                )}
                <p className="mt-1 text-xs text-slate-600">
                  {advice.vibeLine}
                </p>
              </>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

