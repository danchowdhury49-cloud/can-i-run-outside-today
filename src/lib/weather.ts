import { getRegionBySlug } from "./regions";
import type { Region } from "./regions";
import type { BestWindow, PointHourly, PointSnapshot, PointWeather, RegionSummary, RegionWeatherResponse } from "./weather-types";
import { scoreConditions } from "./advice";

type CacheEntry = {
  timestamp: number;
  data: RegionWeatherResponse;
};

const CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export type WeatherRequestParams = {
  regionSlug: string;
  hourOffset: number; // 0..24
};

function cacheKey(params: WeatherRequestParams): string {
  return `${params.regionSlug}:${params.hourOffset}`;
}

function isFresh(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_TTL_MS;
}

type OpenMeteoResponse = {
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation: number[];
    precipitation_probability: number[];
    windspeed_10m: number[];
    windgusts_10m: number[];
  };
};

async function fetchForPoint(lat: number, lon: number): Promise<OpenMeteoResponse> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat.toString());
  url.searchParams.set("longitude", lon.toString());
  url.searchParams.set(
    "hourly",
    [
      "temperature_2m",
      "apparent_temperature",
      "precipitation",
      "precipitation_probability",
      "windspeed_10m",
      "windgusts_10m"
    ].join(",")
  );
  url.searchParams.set("timezone", "Europe/London");

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`Open-Meteo error: ${res.status}`);
  }
  return (await res.json()) as OpenMeteoResponse;
}

async function fetchWithConcurrencyLimit<T>(items: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await items[current]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

function buildHourly(resp: OpenMeteoResponse): PointHourly {
  return {
    time: resp.hourly.time,
    temperature: resp.hourly.temperature_2m,
    apparentTemperature: resp.hourly.apparent_temperature,
    precipitation: resp.hourly.precipitation,
    precipitationProbability: resp.hourly.precipitation_probability,
    windspeed: resp.hourly.windspeed_10m,
    windgusts: resp.hourly.windgusts_10m
  };
}

function findIndexForOffset(times: string[], hourOffset: number): number {
  const now = new Date();
  const base = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    0,
    0,
    0
  );
  const target = new Date(base.getTime() + hourOffset * 60 * 60 * 1000);
  const targetHour = target.getHours();
  const targetDate = target.getDate();
  const targetMonth = target.getMonth();
  const targetYear = target.getFullYear();

  let bestIndex = 0;
  let bestDiff = Number.POSITIVE_INFINITY;

  times.forEach((iso, idx) => {
    const d = new Date(iso);
    if (
      d.getHours() === targetHour &&
      d.getDate() === targetDate &&
      d.getMonth() === targetMonth &&
      d.getFullYear() === targetYear
    ) {
      const diff = Math.abs(d.getTime() - target.getTime());
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIndex = idx;
      }
    }
  });

  return bestIndex;
}

function snapshotAt(hourly: PointHourly, index: number): PointSnapshot {
  return {
    time: hourly.time[index],
    temperature: hourly.temperature[index],
    apparentTemperature: hourly.apparentTemperature[index],
    precipitation: hourly.precipitation[index],
    precipitationProbability: hourly.precipitationProbability[index],
    windspeed: hourly.windspeed[index],
    windgusts: hourly.windgusts[index]
  };
}

function summariseRegion(region: Region, points: PointWeather[], hourOffset: number): RegionSummary {
  const n = points.length || 1;
  let temperatureMean = 0;
  let temperatureMin = Number.POSITIVE_INFINITY;
  let temperatureMax = Number.NEGATIVE_INFINITY;
  let apparentTemperatureMean = 0;
  let precipitationMean = 0;
  let precipitationProbabilityMean = 0;
  let windspeedMean = 0;
  let windgustsMean = 0;
  const time = points[0]?.selected.time ?? new Date().toISOString();

  for (const p of points) {
    const s = p.selected;
    temperatureMean += s.temperature;
    apparentTemperatureMean += s.apparentTemperature;
    precipitationMean += s.precipitation;
    precipitationProbabilityMean += s.precipitationProbability;
    windspeedMean += s.windspeed;
    windgustsMean += s.windgusts;
    temperatureMin = Math.min(temperatureMin, s.temperature);
    temperatureMax = Math.max(temperatureMax, s.temperature);
  }

  temperatureMean /= n;
  apparentTemperatureMean /= n;
  precipitationMean /= n;
  precipitationProbabilityMean /= n;
  windspeedMean /= n;
  windgustsMean /= n;

  if (!Number.isFinite(temperatureMin)) temperatureMin = temperatureMean;
  if (!Number.isFinite(temperatureMax)) temperatureMax = temperatureMean;

  return {
    regionSlug: region.slug,
    hourOffset,
    time,
    temperatureMean,
    temperatureMin,
    temperatureMax,
    apparentTemperatureMean,
    precipitationMean,
    precipitationProbabilityMean,
    windspeedMean,
    windgustsMean
  };
}

function computeBestWindow(region: Region, hourlyByPoint: PointHourly[], times: string[]): BestWindow | null {
  const maxOffset = 24;
  if (times.length === 0 || hourlyByPoint.length === 0) return null;

  const baseIndex = findIndexForOffset(times, 0);
  const scoresByOffset: number[] = [];

  for (let offset = 0; offset <= maxOffset; offset++) {
    const idx = baseIndex + offset;
    if (idx >= times.length) break;
    let tempMean = 0;
    let apparentMean = 0;
    let precipMean = 0;
    let precipProbMean = 0;
    let windMean = 0;
    let gustMean = 0;
    const n = hourlyByPoint.length;

    for (const h of hourlyByPoint) {
      tempMean += h.temperature[idx];
      apparentMean += h.apparentTemperature[idx];
      precipMean += h.precipitation[idx];
      precipProbMean += h.precipitationProbability[idx];
      windMean += h.windspeed[idx];
      gustMean += h.windgusts[idx];
    }

    tempMean /= n;
    apparentMean /= n;
    precipMean /= n;
    precipProbMean /= n;
    windMean /= n;
    gustMean /= n;

    const score = scoreConditions({
      temperature: tempMean,
      apparentTemperature: apparentMean,
      precipitation: precipMean,
      precipitationProbability: precipProbMean,
      windspeed: windMean,
      windgusts: gustMean
    });

    scoresByOffset[offset] = score;
  }

  if (scoresByOffset.length < 2) return null;

  let bestStart = 0;
  let bestAvg = -1;
  for (let start = 0; start < scoresByOffset.length - 1; start++) {
    const avg = (scoresByOffset[start] + scoresByOffset[start + 1]) / 2;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestStart = start;
    }
  }

  return {
    startOffset: bestStart,
    endOffset: bestStart + 2,
    averageScore: Math.round(bestAvg)
  };
}

export async function getRegionWeather(params: WeatherRequestParams): Promise<RegionWeatherResponse> {
  const region = getRegionBySlug(params.regionSlug);
  if (!region) {
    throw new Error("Unknown region");
  }

  const key = cacheKey(params);
  const cached = CACHE.get(key);
  if (cached && isFresh(cached)) {
    return cached.data;
  }

  const pointFns = region.samplePoints.map(
    (p) => () => fetchForPoint(p.lat, p.lon)
  );

  const responses = await fetchWithConcurrencyLimit(pointFns, 4);

  const hourlyByPoint: PointHourly[] = responses.map(buildHourly);

  const baseTimes = hourlyByPoint[0]?.time ?? [];
  const index = findIndexForOffset(baseTimes, params.hourOffset);

  const points: PointWeather[] = region.samplePoints.map((p, i) => {
    const hourly = hourlyByPoint[i];
    const selected = snapshotAt(hourly, index);
    const score = scoreConditions({
      temperature: selected.temperature,
      apparentTemperature: selected.apparentTemperature,
      precipitation: selected.precipitation,
      precipitationProbability: selected.precipitationProbability,
      windspeed: selected.windspeed,
      windgusts: selected.windgusts
    });

    return {
      point: p,
      hourly,
      selected,
      selectedIndex: index,
      score
    };
  });

  const summary = summariseRegion(region, points, params.hourOffset);
  const bestWindow = computeBestWindow(region, hourlyByPoint, baseTimes);

  const data: RegionWeatherResponse = {
    points,
    summary,
    bestWindow
  };

  CACHE.set(key, { timestamp: Date.now(), data });
  return data;
}

