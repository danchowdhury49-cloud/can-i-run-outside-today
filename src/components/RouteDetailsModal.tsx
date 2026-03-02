"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type AreaLike = {
  slug: string;
  name: string;
  // expected from your areas.ts
  center: [number, number]; // [lat, lon]
};

type RouteLike = {
  id: string;
  name: string;
  regionSlug: string;
  areaSlug?: string;
  distanceKm: number;
  terrain: "Road" | "Trail" | "Mixed";
  vibe: string;
  notes: string;
  coordinates?: [number, number][]; // [lng, lat]
};

type Props = {
  open: boolean;
  onClose: () => void;
  regionSlug: string;
  area: AreaLike;
  route: RouteLike;
};

type Hour = {
  time: string;
  temp: number | null;
  feels: number | null;
  rainProb: number | null;
  gusts: number | null;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function scoreHour(h: Hour) {
  // A simple “runner comfort” heuristic (tweak later):
  // - Penalize rain probability + gusts
  // - Prefer feels-like around 10–16C (UK default “nice run”)
  const rain = h.rainProb ?? 0;
  const gusts = h.gusts ?? 0;
  const feels = h.feels ?? h.temp ?? 12;

  const rainPenalty = clamp(rain / 100, 0, 1) * 55; // up to -55
  const gustPenalty = clamp((gusts - 15) / 50, 0, 1) * 35; // gusts >15 start hurting
  const tempPenalty = clamp(Math.abs(feels - 13) / 12, 0, 1) * 20; // best around 13C

  const score = 100 - rainPenalty - gustPenalty - tempPenalty;
  return clamp(score, 0, 100);
}

function pickBest(hours: Hour[], fromHour: number, toHour: number) {
  const inWindow = hours.filter((h) => {
    const dt = new Date(h.time);
    const hr = dt.getHours();
    return hr >= fromHour && hr <= toHour;
  });

  if (inWindow.length === 0) return null;

  let best = inWindow[0];
  let bestScore = scoreHour(best);

  for (const h of inWindow.slice(1)) {
    const s = scoreHour(h);
    if (s > bestScore) {
      best = h;
      bestScore = s;
    }
  }

  return { hour: best, score: Math.round(bestScore) };
}

function fmtTime(iso: string) {
  const dt = new Date(iso);
  const hh = dt.getHours().toString().padStart(2, "0");
  return `${hh}:00`;
}

export function RouteDetailsModal({ open, onClose, regionSlug, area, route }: Props) {
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const [loadingWx, setLoadingWx] = useState(false);
  const [wxError, setWxError] = useState<string | null>(null);
  const [hours, setHours] = useState<Hour[] | null>(null);

  const styleUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_MAPTILER_KEY
      ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
      : "https://demotiles.maplibre.org/style.json";
  }, []);

  const centerLngLat = useMemo<[number, number]>(() => {
    // area.center is [lat, lon]
    return [area.center[1], area.center[0]];
  }, [area.center]);

  // ---- Mini map init/draw
  useEffect(() => {
    if (!open) return;
    if (!mapElRef.current) return;
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapElRef.current,
      style: styleUrl,
      center: centerLngLat,
      zoom: 12,
      interactive: false
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "top-right");

    map.on("load", () => {
      const hasLine = Array.isArray(route.coordinates) && route.coordinates.length >= 2;

      if (hasLine) {
        map.addSource("route-line", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: { type: "LineString", coordinates: route.coordinates! },
                properties: {}
              }
            ]
          }
        });

        map.addLayer({
          id: "route-line-layer",
          type: "line",
          source: "route-line",
          paint: {
            "line-width": 5,
            "line-opacity": 0.9
          }
        });

        // Fit to line bounds
        const bounds = route.coordinates!.reduce(
          (b, c) => b.extend(c as [number, number]),
          new maplibregl.LngLatBounds(route.coordinates![0], route.coordinates![0])
        );
        map.fitBounds(bounds, { padding: 24, duration: 0 });
      } else {
        // If no coordinates yet, show a point at the area centre
        new maplibregl.Marker({ color: "#16a34a" }).setLngLat(centerLngLat).addTo(map);
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [open, route.coordinates, centerLngLat, styleUrl]);

  // ---- Weather fetch (Open-Meteo hourly next 24h)
  useEffect(() => {
    if (!open) return;

    const [lat, lon] = area.center;

    let cancelled = false;
    setLoadingWx(true);
    setWxError(null);

    (async () => {
      try {
        const url =
          "https://api.open-meteo.com/v1/forecast" +
          `?latitude=${encodeURIComponent(lat)}` +
          `&longitude=${encodeURIComponent(lon)}` +
          "&current=temperature_2m,apparent_temperature,precipitation_probability,wind_gusts_10m" +
          "&hourly=temperature_2m,apparent_temperature,precipitation_probability,wind_gusts_10m" +
          "&forecast_days=2" +
          "&timezone=auto";

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
        const json = await res.json();

        const t: string[] = json.hourly?.time ?? [];
        const temp: number[] = json.hourly?.temperature_2m ?? [];
        const feels: number[] = json.hourly?.apparent_temperature ?? [];
        const rainProb: number[] = json.hourly?.precipitation_probability ?? [];
        const gusts: number[] = json.hourly?.wind_gusts_10m ?? [];

        const now = new Date();
        const next24: Hour[] = [];

        for (let i = 0; i < t.length; i++) {
          const dt = new Date(t[i]);
          const diffHrs = (dt.getTime() - now.getTime()) / (1000 * 60 * 60);
          if (diffHrs < 0) continue;
          if (diffHrs > 24) break;

          next24.push({
            time: t[i],
            temp: typeof temp[i] === "number" ? temp[i] : null,
            feels: typeof feels[i] === "number" ? feels[i] : null,
            rainProb: typeof rainProb[i] === "number" ? rainProb[i] : null,
            gusts: typeof gusts[i] === "number" ? gusts[i] : null
          });
        }

        if (!cancelled) setHours(next24);
      } catch (e: any) {
        if (!cancelled) setWxError(e?.message ?? "Weather failed");
      } finally {
        if (!cancelled) setLoadingWx(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, area.center]);

  const current = useMemo(() => (hours && hours.length > 0 ? hours[0] : null), [hours]);

  const bestMorning = useMemo(() => (hours ? pickBest(hours, 6, 10) : null), [hours]);
  const bestLunch = useMemo(() => (hours ? pickBest(hours, 11, 14) : null), [hours]);
  const bestEvening = useMemo(() => (hours ? pickBest(hours, 16, 20) : null), [hours]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40"
        aria-label="Close modal"
      />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b border-sky-100 bg-sky-50/40 p-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              {area.name} · {route.terrain} · {route.distanceKm.toFixed(1)} km
            </div>
            <h2 className="text-lg font-semibold text-slate-900">{route.name}</h2>
            <p className="mt-1 text-sm text-slate-700">{route.vibe}</p>
            <p className="mt-1 text-xs text-slate-600">{route.notes}</p>
          </div>

          <div className="flex items-center gap-2">
            <a
              className="rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-primary"
              href={`/regions/${regionSlug}?area=${encodeURIComponent(area.slug)}`}
            >
              Open on map
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-primary"
            >
              Close
            </button>
          </div>
        </div>

        <div className="grid gap-4 p-4 md:grid-cols-2">
          {/* mini map */}
          <div className="rounded-2xl border border-sky-200 bg-slate-100">
            <div ref={mapElRef} className="h-[220px] w-full rounded-2xl" />
            <div className="px-3 py-2 text-[11px] text-slate-600">
              {route.coordinates?.length ? "Route preview" : "Area preview (add route coordinates later for the full line)"}
            </div>
          </div>

          {/* weather + best windows */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-sky-200 bg-white p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Current weather (near {area.name})
              </div>

              {loadingWx && <div className="mt-1 text-sm text-slate-600">Loading…</div>}
              {wxError && <div className="mt-1 text-sm text-rose-700">{wxError}</div>}

              {!loadingWx && !wxError && current && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl bg-sky-50 p-2">
                    <div className="text-[11px] text-slate-600">Feels like</div>
                    <div className="font-semibold text-slate-900">
                      {(current.feels ?? current.temp ?? 0).toFixed(1)}°C
                    </div>
                  </div>
                  <div className="rounded-xl bg-sky-50 p-2">
                    <div className="text-[11px] text-slate-600">Rain chance</div>
                    <div className="font-semibold text-slate-900">
                      {current.rainProb ?? 0}%
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-sky-200 bg-white p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Best time to run (next 24h)
              </div>

              {!hours && !wxError && <div className="mt-1 text-sm text-slate-600">Loading…</div>}
              {hours && (
                <div className="mt-2 space-y-2 text-sm">
                  <BestRow label="Morning" best={bestMorning} />
                  <BestRow label="Lunch" best={bestLunch} />
                  <BestRow label="Afternoon/Evening" best={bestEvening} />
                </div>
              )}

              <div className="mt-2 text-[11px] text-slate-500">
                Scoring is a simple blend of rain chance, gusts and feels-like temperature (we can tune this later).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BestRow({
  label,
  best
}: {
  label: string;
  best: { hour: Hour; score: number } | null;
}) {
  if (!best) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
        <div className="font-medium text-slate-900">{label}</div>
        <div className="text-slate-600">No data</div>
      </div>
    );
  }

  const h = best.hour;
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
      <div>
        <div className="font-medium text-slate-900">{label}</div>
        <div className="text-[11px] text-slate-600">
          {fmtTime(h.time)} · rain {h.rainProb ?? 0}% · gusts {Math.round(h.gusts ?? 0)} km/h
        </div>
      </div>
      <div className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
        Score {best.score}/100
      </div>
    </div>
  );
}
