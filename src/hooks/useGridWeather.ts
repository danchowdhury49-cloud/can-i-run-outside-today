"use client";

import { useEffect, useMemo, useState } from "react";
import type { Region } from "@/lib/regions";

// What MapView needs for the heatmap source
export type GridPoint = {
  lat: number;
  lon: number;
  selected: {
    precipitationProbability: number; // %
    windgusts: number; // km/h
    apparentTemperature: number; // °C
  };
};

type Result = {
  points: GridPoint[];
};

type State = {
  data: Result | null;
  loading: boolean;
  error: string | null;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pickTargetIsoHour(hourOffset: number) {
  const now = new Date();
  // round down to hour
  now.setMinutes(0, 0, 0);
  const target = new Date(now.getTime() + hourOffset * 60 * 60 * 1000);
  return target.toISOString().slice(0, 13) + ":00";
}

/**
 * Build a coarse grid within region bbox.
 * We aim for ~70–120 points (nice heatmap, still fast).
 */
function buildGrid(region: Region, targetCount = 90) {
  const [minLon, minLat, maxLon, maxLat] = region.bbox;

  const latSpan = Math.abs(maxLat - minLat);
  const lonSpan = Math.abs(maxLon - minLon);

  // Avoid div-by-zero
  const aspect = lonSpan / Math.max(latSpan, 0.0001);

  // Choose rows/cols based on aspect ratio
  const rows = clamp(Math.round(Math.sqrt(targetCount / Math.max(aspect, 0.3))), 6, 16);
  const cols = clamp(Math.round(rows * aspect), 6, 22);

  const points: { lat: number; lon: number }[] = [];
  for (let r = 0; r < rows; r++) {
    const tLat = rows === 1 ? 0.5 : r / (rows - 1);
    const lat = minLat + tLat * (maxLat - minLat);

    for (let c = 0; c < cols; c++) {
      const tLon = cols === 1 ? 0.5 : c / (cols - 1);
      const lon = minLon + tLon * (maxLon - minLon);

      points.push({ lat, lon });
    }
  }
  return points;
}

/**
 * Open-Meteo supports multiple locations by comma-separating latitude/longitude.
 * It returns a list/array of location objects.
 */
async function fetchOpenMeteoMulti(points: { lat: number; lon: number }[]) {
  const latCsv = points.map((p) => p.lat.toFixed(5)).join(",");
  const lonCsv = points.map((p) => p.lon.toFixed(5)).join(",");

  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${encodeURIComponent(latCsv)}` +
    `&longitude=${encodeURIComponent(lonCsv)}` +
    `&hourly=apparent_temperature,precipitation_probability,windgusts_10m` +
    `&forecast_days=2` +
    `&timezone=Europe%2FLondon`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo error ${res.status}`);
  return res.json();
}

function findHourIndex(times: string[], targetIsoHour: string) {
  // time strings look like "2026-03-02T17:00"
  const idx = times.findIndex((t) => t === targetIsoHour);
  if (idx !== -1) return idx;

  // fallback: nearest by string compare around target hour
  // (times are ISO sorted)
  let best = 0;
  let bestDiff = Infinity;
  for (let i = 0; i < times.length; i++) {
    const diff = Math.abs(Date.parse(times[i] + ":00Z") - Date.parse(targetIsoHour + ":00Z"));
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return best;
}

export function useGridWeather(region: Region, hourOffset: number) {
  const grid = useMemo(() => buildGrid(region, 96), [region.slug]); // stable per region
  const [state, setState] = useState<State>({ data: null, loading: false, error: null });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        const json = await fetchOpenMeteoMulti(grid);

        // Open-Meteo multi-location returns an array/list of location responses
        const locations: any[] = Array.isArray(json) ? json : json?.results ?? json?.data ?? [];

        if (!Array.isArray(locations) || locations.length === 0) {
          throw new Error("Unexpected Open-Meteo response format (no locations array).");
        }

        const targetIsoHour = pickTargetIsoHour(hourOffset);

        const out: GridPoint[] = locations.map((loc) => {
          const times: string[] = loc?.hourly?.time ?? [];
          const i = findHourIndex(times, targetIsoHour);

          const feels = Number(loc?.hourly?.apparent_temperature?.[i]);
          const rainPct = Number(loc?.hourly?.precipitation_probability?.[i]);
          const gusts = Number(loc?.hourly?.windgusts_10m?.[i]);

          // Use the actual location coords returned
          const lat = Number(loc?.latitude);
          const lon = Number(loc?.longitude);

          return {
            lat,
            lon,
            selected: {
              apparentTemperature: Number.isFinite(feels) ? feels : 0,
              precipitationProbability: Number.isFinite(rainPct) ? rainPct : 0,
              windgusts: Number.isFinite(gusts) ? gusts : 0
            }
          };
        });

        if (!cancelled) setState({ data: { points: out }, loading: false, error: null });
      } catch (e: any) {
        if (!cancelled) {
          setState({ data: null, loading: false, error: e?.message ?? "Failed to load grid weather." });
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [region.slug, hourOffset, grid]);

  return state;
}