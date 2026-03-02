"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Region } from "@/lib/regions";
import type { PointWeather } from "@/lib/weather-types";
import { UK_CITIES } from "@/lib/uk-cities";

type Props = {
  region: Region;
  points: PointWeather[] | null;

  /**
   * If true, the map will fit to the current region bbox.
   * Set this to false for initial load (UK-wide), then true after user selects a region.
   */
  autoFit?: boolean;

  /**
   * Increment this value to force a re-fit even if the region slug didn't change
   * (e.g. user re-selects "London").
   */
  fitKey?: number;
};

const SOURCE_ID = "run-points";
const LAYER_ID = "run-points-layer";

const CITIES_SOURCE_ID = "uk-cities";
const CITIES_LAYER_ID = "uk-cities-layer";
const CITIES_DOT_LAYER_ID = "uk-cities-dot-layer";

export function MapView({ region, points, autoFit = false, fitKey = 0 }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
  
    // ✅ Choose MapTiler if key exists, otherwise fallback
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

    map.addControl(
      new maplibregl.NavigationControl({ visualizePitch: false }),
      "top-right"
    );

    const hoverPopup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 10
    });

    map.on("load", () => {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] }
      });

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
            <div>Temp: ${Number(props.temperature).toFixed(1)}°C feels ${Number(
          props.apparentTemperature
        ).toFixed(1)}°C</div>
            <div>Rain: ${Number(props.precipitationProbability).toFixed(
              0
            )}% · ${Number(props.precipitation).toFixed(1)}mm</div>
            <div>Wind: ${Number(props.windspeed).toFixed(
              0
            )} km/h · gusts ${Number(props.windgusts).toFixed(0)} km/h</div>
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
            <div>Temp: ${Number(props.temperature).toFixed(1)}°C feels ${Number(
          props.apparentTemperature
        ).toFixed(1)}°C</div>
            <div>Rain: ${Number(props.precipitationProbability).toFixed(
              0
            )}% · ${Number(props.precipitation).toFixed(1)}mm</div>
            <div>Wind: ${Number(props.windspeed).toFixed(
              0
            )} km/h · gusts ${Number(props.windgusts).toFixed(0)} km/h</div>
          </div>
        `;

        new maplibregl.Popup({ closeButton: false })
          .setLngLat(coordinates)
          .setHTML(html)
          .addTo(map);
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ✅ Fit on selection AND allow re-fit via fitKey bump (even if same region)
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    if (!source) return;

    const features = (points ?? []).map((p) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [p.point.lon, p.point.lat]
      },
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

    source.setData({
      type: "FeatureCollection",
      features
    });
  }, [points]);

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
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full border border-white shadow"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </span>
  );
}