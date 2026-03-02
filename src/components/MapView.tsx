"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Region } from "@/lib/regions";
import type { PointWeather } from "@/lib/weather-types";

type Props = {
  region: Region;
  points: PointWeather[] | null;
};

const SOURCE_ID = "run-points";
const LAYER_ID = "run-points-layer";

export function MapView({ region, points }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [region.center[1], region.center[0]],
      zoom: 6
      // attributionControl: true,  // ❌ remove this; MapLibre defaults are fine
    });

    map.addControl(
      new maplibregl.NavigationControl({ visualizePitch: false }),
      "top-right"
    );

    map.on("load", () => {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
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

      map.on("click", LAYER_ID, (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const props = feature.properties as any;
        const coordinates =
          feature.geometry.type === "Point"
            ? feature.geometry.coordinates.slice()
            : null;

        if (!coordinates) return;

        const html = `
          <div class="text-xs">
            <div class="font-semibold mb-1">${props.name}</div>
            <div>Score: ${props.score}/100</div>
            <div>Temp: ${props.temperature.toFixed(1)}°C feels ${props.apparentTemperature.toFixed(1)}°C</div>
            <div>Rain: ${props.precipitationProbability.toFixed(0)}% · ${props.precipitation.toFixed(1)}mm</div>
            <div>Wind: ${props.windspeed.toFixed(0)} km/h · gusts ${props.windgusts.toFixed(0)} km/h</div>
          </div>
        `;

        new maplibregl.Popup({ closeButton: false })
          .setLngLat(coordinates as [number, number])
          .setHTML(html)
          .addTo(map);
      });

      // Iteration 2 note: this is where we would add raster/tiling weather overlays
      // as separate layers, keyed by the selected hour, on top of the base map.
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [region.center]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const [minLon, minLat, maxLon, maxLat] = region.bbox;
    map.fitBounds(
      [
        [minLon, minLat],
        [maxLon, maxLat]
      ],
      { padding: 32, duration: 500 }
    );
  }, [region.bbox, region.slug]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !points) return;

    const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    if (!source) return;

    const features = points.map((p) => ({
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