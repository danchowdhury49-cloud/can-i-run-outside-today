"use client";

import { useEffect, useState } from "react";
import type { RegionWeatherResponse } from "@/lib/weather-types";

type State = {
  data: RegionWeatherResponse | null;
  loading: boolean;
  error: string | null;
};

export function useWeather(regionSlug: string, hourOffset: number) {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    async function run() {
      try {
        const res = await fetch("/api/weather", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ regionSlug, hourOffset })
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Request failed");
        }
        const json = (await res.json()) as RegionWeatherResponse;
        if (cancelled) return;
        setState({ data: json, loading: false, error: null });
      } catch (err) {
        if (cancelled) return;
        setState({
          data: null,
          loading: false,
          error:
            "Weather data is having a little lie-down. Please try again in a moment."
        });
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [regionSlug, hourOffset]);

  return state;
}

