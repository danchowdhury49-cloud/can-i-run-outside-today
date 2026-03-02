"use client";

import { useEffect, useMemo, useRef } from "react";
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Region } from "@/lib/regions";
import type { PointWeather } from "@/lib/weather-types";
import { UK_CITIES } from "@/lib/uk-cities";
import type { GridPoint } from "@/hooks/useGridWeather";

export type HeatmapMode = "none" | "rain" | "gusts" | "feelslike";

type Props = {
  region: Region;
  points: PointWeather[] | null;

  // NEW: grid points for heatmap when zoomed out
  gridPoints: GridPoint[] | null;

  autoFit?: boolean;
  fitKey?: number;
  heatmapMode?: HeatmapMode;
};

const SOURCE_ID = "run-points"; // marker points
const LAYER_ID = "run-points-layer";

const GRID_SOURCE_ID = "heatmap-points"; // heatmap source (grid or points depending on zoom)
const HEATMAP_LAYER_ID = "run-heatmap-layer";

const CITIES_SOURCE_ID = "uk-cities";
const CITIES_LAYER_ID = "uk-cities-layer";
const CITIES_DOT_LAYER_ID = "uk-cities-dot-layer";

const ZOOM_SWITCH = 11; // <11 = grid, >=11 = curated points heatmap

export function MapView({
  region,
  points,
  gridPoints,
  autoFit = false,
  fitKey = 0,
  heatmapMode = "none"
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  // Keep track of which dataset the heatmap should use
  const useCuratedForHeatRef = useRef(false);

  const heatmapPaint = useMemo(() => {
    if (heatmapMode === "rain") {
      return {
        "heatmap-weight": ["interpolate", ["linear"], ["get", "heat_rain"], 0, 0, 100, 1],
        "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 4, 0.8, 10, 1.6, 14, 2.4],
        "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 4, 14, 10, 28, 14, 44],
        "heatmap-opacity": 0.85,
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, "rgba(0,0,0,0)",
          0.15, "rgba(56,189,248,0.6)",
          0.35, "rgba(34,197,94,0.75)",
          0.6, "rgba(250,204,21,0.85)",
          0.85, "rgba(249,115,22,0.9)",
          1, "rgba(239,68,68,0.95)"
        ]
      } as const;
    }

    if (heatmapMode === "gusts") {
      return {
        "heatmap-weight": ["interpolate", ["linear"], ["get", "heat_gusts"], 0, 0, 25, 0.2, 45, 0.5, 65, 0.8, 85, 1],
        "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 4, 0.8, 10, 1.6, 14, 2.4],
        "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 4, 14, 10, 28, 14, 44],
        "heatmap-opacity": 0.85,
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, "rgba(0,0,0,0)",
          0.15, "rgba(34,197,94,0.6)",
          0.35, "rgba(56,189,248,0.75)",
          0.6, "rgba(250,204,21,0.85)",
          0.85, "rgba(249,115,22,0.9)",
          1, "rgba(239,68,68,0.95)"
        ]
      } as const;
    }

    if (heatmapMode === "feelslike") {
      return {
        "heatmap-weight": ["interpolate", ["linear"], ["get", "heat_feels"], -5, 1, 5, 0.6, 12, 0.25, 20, 0.6, 28, 1],
        "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 4, 0.8, 10, 1.6, 14, 2.4],
        "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 4, 14, 10, 28, 14, 44],
        "heatmap-opacity": 0.85,
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, "rgba(0,0,0,0)",
          0.2, "rgba(59,130,246,0.75)",
          0.45, "rgba(34,197,94,0.65)",
          0.7, "rgba(250,204,21,0.85)",
          0.9, "rgba(249,115,22,0.9)",
          1, "rgba(239,68,68,0.95)"
        ]
      } as const;
    }

    return null;
  }, [heatmapMode]);

  function buildMarkerFeatures(data: PointWeather[]) {
    return data.map((p) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [p.point.lon, p.point.lat] },
      properties: {
        name: p.point.name,
        score: p.score,
        temperature: p.selected.temperature,
        apparentTemperature: p.selected.apparentTemperature,
        precipitation: p.selected.precipitation,
        precipitationProbability: p.selected.precipitationProbability,
        windspeed: p.selected.windspeed,
        windgusts: p.selected.windgusts,

        // heat props (for when we use curated points as heatmap)
        heat_rain: p.selected.precipitationProbability,
        heat_gusts: p.selected.windgusts,
        heat_feels: p.selected.apparentTemperature
      }
    }));
  }

  function buildGridFeatures(data: GridPoint[]) {
    return data.map((p) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [p.lon, p.lat] },
      properties: {
        heat_rain: p.selected.precipitationProbability,
        heat_gusts: p.selected.windgusts,
        heat_feels: p.selected.apparentTemperature
      }
    }));
  }

  function updateHeatSource() {
    const map = mapRef.current;
    if (!map) return;

    const source = map.getSource(GRID_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    if (!source) return;

    const shouldUseCurated = useCuratedForHeatRef.current;

    const curated = points ?? [];
    const grid = gridPoints ?? [];

    const features =
      shouldUseCurated && curated.length > 0
        ? buildMarkerFeatures(curated)
        : grid.length > 0
        ? buildGridFeatures(grid)
        : [];

    source.setData({ type: "FeatureCollection", features });
  }

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const styleUrl =
      process.env.NEXT_PUBLIC_MAPTILER_KEY
        ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
        : "https://demotiles.maplibre.org/style.json";

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [-2.5, 54.5],
      zoom: 5
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "top-right");

    const hoverPopup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 10
    });

    map.on("load", () => {
      // marker source
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] }
      });

      // heatmap source (grid or curated, swapped dynamically)
      map.addSource(GRID_SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] }
      });

      // heatmap layer
      map.addLayer({
        id: HEATMAP_LAYER_ID,
        type: "heatmap",
        source: GRID_SOURCE_ID,
        layout: { visibility: "none" },
        paint: {
          "heatmap-weight": 0,
          "heatmap-intensity": 1,
          "heatmap-radius": 20,
          "heatmap-opacity": 0.8
        }
      });

      // marker layer
      map.addLayer({
        id: LAYER_ID,
        type: "circle",
        source: SOURCE_ID,
        paint: {
          "circle-radius": 6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#ffffff",
          "circle-color": [
            "case",
            [">=", ["get", "score"], 80],
            "#16a34a",
            [">=", ["get", "score"], 60],
            "#0ea5e9",
            [">=", ["get", "score"], 40],
            "#f97316",
            "#e11d48"
          ]
        }
      });

      // cities
      map.addSource(CITIES_SOURCE_ID, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: UK_CITIES.map((c) => ({
            type: "Feature" as const,
            geometry: { type: "Point" as const, coordinates: [c.lon, c.lat] },
            properties: { name: c.name }
          }))
        }
      });

      map.addLayer({
        id: CITIES_DOT_LAYER_ID,
        type: "circle",
        source: CITIES_SOURCE_ID,
        paint: {
          "circle-radius": 3,
          "circle-color": "#1e40af",
          "circle-stroke-width": 1,
          "circle-stroke-color": "#ffffff"
        }
      });

      map.addLayer({
        id: CITIES_LAYER_ID,
        type: "symbol",
        source: CITIES_SOURCE_ID,
        layout: {
          "text-field": ["get", "name"],
          "text-size": 12,
          "text-offset": [0, 1.1],
          "text-anchor": "top",
          "text-allow-overlap": true,
          "text-ignore-placement": true
        },
        paint: {
          "text-color": "#0f172a",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.25
        }
      });

      // zoom switch logic
      const refreshZoomMode = () => {
        useCuratedForHeatRef.current = map.getZoom() >= ZOOM_SWITCH;
        updateHeatSource();
      };
      refreshZoomMode();
      map.on("zoomend", refreshZoomMode);

      // marker hover popup (unchanged)
      map.on("mousemove", LAYER_ID, (e) => {
        map.getCanvas().style.cursor = "pointer";
        const feature = e.features?.[0];
        if (!feature) return;

        const props = feature.properties as any;
        const coordinates =
          feature.geometry.type === "Point"
            ? (feature.geometry.coordinates.slice() as [number, number])
            : null;
        if (!coordinates) return;

        const html = `
          <div class="text-xs">
            <div class="font-semibold mb-1">${props.name}</div>
            <div><b>Score:</b> ${props.score}/100</div>
            <div>Temp: ${Number(props.temperature).toFixed(1)}°C feels ${Number(props.apparentTemperature).toFixed(1)}°C</div>
            <div>Rain: ${Number(props.precipitationProbability).toFixed(0)}% · ${Number(props.precipitation).toFixed(1)}mm</div>
            <div>Wind: ${Number(props.windspeed).toFixed(0)} km/h · gusts ${Number(props.windgusts).toFixed(0)} km/h</div>
          </div>
        `;
        hoverPopup.setLngLat(coordinates).setHTML(html).addTo(map);
      });

      map.on("mouseleave", LAYER_ID, () => {
        map.getCanvas().style.cursor = "";
        hoverPopup.remove();
      });

      map.on("click", LAYER_ID, (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const props = feature.properties as any;
        const coordinates =
          feature.geometry.type === "Point"
            ? (feature.geometry.coordinates.slice() as [number, number])
            : null;
        if (!coordinates) return;

        const html = `
          <div class="text-xs">
            <div class="font-semibold mb-1">${props.name}</div>
            <div><b>Score:</b> ${props.score}/100</div>
            <div>Temp: ${Number(props.temperature).toFixed(1)}°C feels ${Number(props.apparentTemperature).toFixed(1)}°C</div>
            <div>Rain: ${Number(props.precipitationProbability).toFixed(0)}% · ${Number(props.precipitation).toFixed(1)}mm</div>
            <div>Wind: ${Number(props.windspeed).toFixed(0)} km/h · gusts ${Number(props.windgusts).toFixed(0)} km/h</div>
          </div>
        `;
        new maplibregl.Popup({ closeButton: false }).setLngLat(coordinates).setHTML(html).addTo(map);
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fit to region only when enabled
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!autoFit) return;

    const [minLon, minLat, maxLon, maxLat] = region.bbox;
    map.fitBounds(
      [
        [minLon, minLat],
        [maxLon, maxLat]
      ],
      { padding: 32, duration: 500 }
    );
  }, [autoFit, fitKey, region.bbox, region.slug]);

  // Update marker source when curated points change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    if (!source) return;

    const features = (points ?? []).map((p) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [p.point.lon, p.point.lat] },
      properties: {
        name: p.point.name,
        score: p.score,
        temperature: p.selected.temperature,
        apparentTemperature: p.selected.apparentTemperature,
        precipitation: p.selected.precipitation,
        precipitationProbability: p.selected.precipitationProbability,
        windspeed: p.selected.windspeed,
        windgusts: p.selected.windgusts
      }
    }));

    source.setData({ type: "FeatureCollection", features });

    // curated may also be used for heatmap at high zoom
    updateHeatSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  // Update heat source when grid points change
  useEffect(() => {
    updateHeatSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridPoints]);

  // Toggle heatmap visibility + paint
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!map.getLayer(HEATMAP_LAYER_ID)) return;

    if (heatmapMode === "none" || !heatmapPaint) {
      map.setLayoutProperty(HEATMAP_LAYER_ID, "visibility", "none");
      return;
    }

    map.setLayoutProperty(HEATMAP_LAYER_ID, "visibility", "visible");

    for (const [k, v] of Object.entries(heatmapPaint)) {
      map.setPaintProperty(HEATMAP_LAYER_ID, k as any, v as any);
    }

    // Ensure data is up to date when overlay toggles on
    updateHeatSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heatmapMode, heatmapPaint]);

  return (
    <div className="flex h-full flex-col gap-2">
      <div
        ref={mapContainerRef}
        className="h-[420px] w-full rounded-2xl border border-sky-200 bg-slate-200 shadow-sm md:h-[520px]"
      />

      <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-[11px] text-slate-600 shadow-sm">
        <span className="font-semibold uppercase tracking-wide">Score legend</span>
        <LegendDot color="#16a34a" label="80–100 Great" />
        <LegendDot color="#0ea5e9" label="60–79 OK" />
        <LegendDot color="#f97316" label="40–59 Caution" />
        <LegendDot color="#e11d48" label="0–39 Avoid" />
        {heatmapMode !== "none" && (
          <span className="ml-2 opacity-80">(heatmap switches to curated at zoom ≥ {ZOOM_SWITCH})</span>
        )}
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-block h-2.5 w-2.5 rounded-full border border-white shadow" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </span>
  );
}