"use client";

import { useEffect, useMemo, useState } from "react";
import { REGIONS, getRegionBySlug } from "@/lib/regions";
import { buildAdvice } from "@/lib/advice";
import { MapView } from "@/components/MapView";
import { RegionSelect } from "@/components/RegionSelect";
import { TimeScrubber } from "@/components/TimeScrubber";
import { RunPanel } from "@/components/RunPanel";
import { BestWindowCard } from "@/components/BestWindowCard";
import { useWeather } from "@/hooks/useWeather";

type Props = {
  initialRegionSlug?: string;
};

export function HomeView({ initialRegionSlug = "london" }: Props) {
  const [regionSlug, setRegionSlug] = useState(initialRegionSlug);
  const [hourOffset, setHourOffset] = useState(0);

  // Start UK-wide (no auto-zoom) and only auto-fit after the user changes region
  const [hasUserSelectedRegion, setHasUserSelectedRegion] = useState(false);

  // ✅ NEW: bump this to force a refit even if the slug doesn't change
  const [fitKey, setFitKey] = useState(0);

  // If the route slug changes away from the initial value, enable auto-fit.
  // (This avoids auto-zooming on first render when default is London.)
  useEffect(() => {
    if (regionSlug !== initialRegionSlug) setHasUserSelectedRegion(true);
  }, [regionSlug, initialRegionSlug]);

  const region = getRegionBySlug(regionSlug) ?? REGIONS[0];
  const { data, loading, error } = useWeather(region.slug, hourOffset);

  const advice = useMemo(
    () => (data ? buildAdvice(data.summary) : null),
    [data]
  );

  return (
    <div className="flex flex-col gap-4 md:h-[calc(100vh-4.5rem)] md:flex-row">
      <section className="md:w-2/3">
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 md:text-xl">
              UK run map
            </h1>
            <p className="text-xs text-slate-600">
              Check conditions across key spots. We sample parks and popular
              running areas rather than random motorways.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <RegionSelect
              value={region.slug}
              onChange={(newSlug) => {
                // selecting a region should focus/zoom to it
                setHasUserSelectedRegion(true);

                // ✅ NEW: always bump fitKey so picking the same region can re-zoom
                setFitKey((k) => k + 1);

                setRegionSlug(newSlug);
              }}
            />
            <TimeScrubber value={hourOffset} onChange={setHourOffset} />
          </div>
        </div>

        <MapView
          region={region}
          points={data?.points ?? null}
          autoFit={hasUserSelectedRegion}
          fitKey={fitKey}
        />
      </section>

      <section className="flex flex-1 flex-col gap-3 md:w-1/3">
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error} In the meantime, classic British advice applies: bring a
            layer and lower your expectations.
          </div>
        )}

        <RunPanel
          summary={data?.summary ?? null}
          advice={advice}
          sessionType="Easy"
        />

        <BestWindowCard window={data?.bestWindow ?? null} />

        <div className="rounded-2xl border border-dashed border-sky-200 bg-white/70 p-3 text-[11px] text-slate-600">
          <div className="mb-1 font-semibold uppercase tracking-wide">Notes</div>
          <p>
            This is Iteration 1. Map markers use simple point samples; future
            versions will add richer weather overlays and more granular session
            types.
          </p>
        </div>

        {loading && !data && (
          <div className="text-[11px] text-slate-500">
            Crunching forecasts and judging gusts&hellip;
          </div>
        )}
      </section>
    </div>
  );
}