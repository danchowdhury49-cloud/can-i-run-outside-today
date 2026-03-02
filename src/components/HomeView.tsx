"use client";

import { useEffect, useMemo, useState } from "react";
import { REGIONS, getRegionBySlug } from "@/lib/regions";
import { buildAdvice } from "@/lib/advice";
import { MapView, type HeatmapMode } from "@/components/MapView";
import { RegionSelect } from "@/components/RegionSelect";
import { TimeScrubber } from "@/components/TimeScrubber";
import { RunPanel } from "@/components/RunPanel";
import { BestWindowCard } from "@/components/BestWindowCard";
import { useWeather } from "@/hooks/useWeather";
import { useGridWeather } from "@/hooks/useGridWeather";

type Props = {
  initialRegionSlug?: string;
};

export function HomeView({ initialRegionSlug = "london" }: Props) {
  const [regionSlug, setRegionSlug] = useState(initialRegionSlug);
  const [hourOffset, setHourOffset] = useState(0);

  const [hasUserSelectedRegion, setHasUserSelectedRegion] = useState(false);
  const [fitKey, setFitKey] = useState(0);

  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>("none");

  useEffect(() => {
    if (regionSlug !== initialRegionSlug) setHasUserSelectedRegion(true);
  }, [regionSlug, initialRegionSlug]);

  const region = getRegionBySlug(regionSlug) ?? REGIONS[0];

  // Curated points (existing)
  const { data, loading, error } = useWeather(region.slug, hourOffset);

  // Grid points (new) for zoomed-out heatmap
  const grid = useGridWeather(region, hourOffset);

  const advice = useMemo(() => (data ? buildAdvice(data.summary) : null), [data]);

  return (
    <div className="flex flex-col gap-4 md:h-[calc(100vh-4.5rem)] md:flex-row">
      <section className="md:w-2/3">
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 md:text-xl">UK run map</h1>
            <p className="text-xs text-slate-600">
              Check conditions across key spots. We sample parks and popular running areas rather than random motorways.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3 md:justify-end">
            <RegionSelect
              value={region.slug}
              onChange={(newSlug) => {
                setHasUserSelectedRegion(true);
                setFitKey((k) => k + 1);
                setRegionSlug(newSlug);
              }}
            />

            <TimeScrubber value={hourOffset} onChange={setHourOffset} />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Overlay</label>
              <div className="inline-flex overflow-hidden rounded-full border border-sky-200 bg-white shadow-sm">
                <HeatBtn active={heatmapMode === "none"} onClick={() => setHeatmapMode("none")}>
                  None
                </HeatBtn>
                <HeatBtn active={heatmapMode === "rain"} onClick={() => setHeatmapMode("rain")}>
                  Rain
                </HeatBtn>
                <HeatBtn active={heatmapMode === "gusts"} onClick={() => setHeatmapMode("gusts")}>
                  Gusts
                </HeatBtn>
                <HeatBtn active={heatmapMode === "feelslike"} onClick={() => setHeatmapMode("feelslike")}>
                  Feels
                </HeatBtn>
              </div>
              {heatmapMode !== "none" && (
                <div className="text-[11px] text-slate-600">
                  Zoomed out uses a grid; zoomed in uses curated spots.
                  {grid.loading ? " (Loading grid…)" : ""}
                </div>
              )}
            </div>
          </div>
        </div>

        <MapView
          region={region}
          points={data?.points ?? null}
          gridPoints={grid.data?.points ?? null}
          autoFit={hasUserSelectedRegion}
          fitKey={fitKey}
          heatmapMode={heatmapMode}
        />
      </section>

      <section className="flex flex-1 flex-col gap-3 md:w-1/3">
        {(error || grid.error) && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error ?? grid.error} In the meantime, classic British advice applies: bring a layer and lower your expectations.
          </div>
        )}

        <RunPanel summary={data?.summary ?? null} advice={advice} sessionType="Easy" />

        <BestWindowCard window={data?.bestWindow ?? null} />

        <div className="rounded-2xl border border-dashed border-sky-200 bg-white/70 p-3 text-[11px] text-slate-600">
          <div className="mb-1 font-semibold uppercase tracking-wide">Notes</div>
          <p>
            Iteration 1: curated markers + a zoom-adaptive heatmap overlay.
          </p>
        </div>

        {loading && !data && <div className="text-[11px] text-slate-500">Crunching forecasts and judging gusts&hellip;</div>}
      </section>
    </div>
  );
}

function HeatBtn({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-1.5 text-sm",
        active ? "bg-sky-50 text-slate-900 font-semibold" : "text-slate-700 hover:bg-slate-50"
      ].join(" ")}
    >
      {children}
    </button>
  );
}