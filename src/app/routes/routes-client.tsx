"use client";

import { useMemo, useState } from "react";
import type { Region } from "@/lib/regions";
import type { Area } from "@/lib/areas";
import { RouteDetailsModal } from "@/components/RouteDetailsModal";

type RouteStub = {
  id: string;
  name: string;
  regionSlug: string;
  areaSlug?: string;
  distanceKm: number;
  terrain: "Road" | "Trail" | "Mixed";
  vibe: string;
  notes: string;
  coordinates?: [number, number][];
};

type Props = {
  regions: Region[];
  routes: RouteStub[];
  areasByRegion: Record<string, Area[]>;
};

function groupByArea(routes: RouteStub[]) {
  const map = new Map<string, RouteStub[]>();
  for (const r of routes) {
    const key = r.areaSlug ?? "__no_area__";
    const existing = map.get(key) ?? [];
    existing.push(r);
    map.set(key, existing);
  }
  return map;
}

export function RoutesClient({ regions, routes, areasByRegion }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedRegionSlug, setSelectedRegionSlug] = useState<string | null>(
    null
  );
  const [selectedAreaSlug, setSelectedAreaSlug] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const selectedRegion = useMemo(() => {
    if (!selectedRegionSlug) return null;
    return regions.find((r) => r.slug === selectedRegionSlug) ?? null;
  }, [regions, selectedRegionSlug]);

  const selectedArea = useMemo(() => {
    if (!selectedRegionSlug || !selectedAreaSlug) return null;
    const areas = areasByRegion[selectedRegionSlug] ?? [];
    return areas.find((a) => a.slug === selectedAreaSlug) ?? null;
  }, [areasByRegion, selectedRegionSlug, selectedAreaSlug]);

  const selectedRoute = useMemo(() => {
    if (!selectedRouteId) return null;
    return routes.find((r) => r.id === selectedRouteId) ?? null;
  }, [routes, selectedRouteId]);

  function openRoute(regionSlug: string, areaSlug: string, routeId: string) {
    setSelectedRegionSlug(regionSlug);
    setSelectedAreaSlug(areaSlug);
    setSelectedRouteId(routeId);
    setOpen(true);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Routes (early beta)
        </h1>
        <p className="text-sm text-slate-600">
          Click a route to see details (mini map + weather + best time windows).
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {regions.map((region) => {
          const regionRoutes = routes.filter((r) => r.regionSlug === region.slug);
          const areas = areasByRegion[region.slug] ?? [];
          const byArea = groupByArea(regionRoutes);

          return (
            <section
              key={region.slug}
              className="rounded-2xl border border-sky-200 bg-white/80 p-3 shadow-sm"
            >
              <div className="mb-1 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  {region.name}
                </h2>
                <span className="rounded-full bg-skysoft px-2 py-0.5 text-[11px] text-slate-700">
                  {regionRoutes.length} routes
                </span>
              </div>

              {areas.length === 0 ? (
                <p className="text-xs text-slate-600">
                  Areas coming soon for this region.
                </p>
              ) : (
                <div className="mt-2 space-y-3">
                  {areas.map((area) => {
                    const areaRoutes = byArea.get(area.slug) ?? [];
                    return (
                      <div
                        key={area.slug}
                        className="rounded-2xl border border-sky-100 bg-white/60 p-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs font-semibold text-slate-900">
                            {area.name}
                          </div>
                          <span className="rounded-full bg-skysoft px-2 py-0.5 text-[11px] text-slate-700">
                            {areaRoutes.length} routes
                          </span>
                        </div>

                        {areaRoutes.length === 0 ? (
                          <p className="mt-1 text-[11px] text-slate-600">
                            Routes coming soon for {area.name}.
                          </p>
                        ) : (
                          <ul className="mt-2 space-y-2 text-xs">
                            {areaRoutes.map((route) => (
                              <li
                                key={route.id}
                                className="rounded-xl bg-skysoft/60 p-2"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    openRoute(region.slug, area.slug, route.id)
                                  }
                                  className="block w-full text-left"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="font-medium text-slate-900">
                                      {route.name}
                                    </div>
                                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-slate-700">
                                      {route.distanceKm.toFixed(1)} km ·{" "}
                                      {route.terrain}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-slate-700">
                                    {route.vibe}
                                  </p>
                                  <p className="mt-1 text-[11px] text-slate-500">
                                    {route.notes}
                                  </p>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {selectedRegion && selectedArea && selectedRoute && (
  <RouteDetailsModal
    open={open}
    onClose={() => setOpen(false)}
    regionSlug={selectedRegion.slug}
    area={{
      ...selectedArea,
      // ✅ fallback to REGION centre if area.center missing
      center:
        (selectedArea as any).center ??
        (selectedRegion as any).center ?? // assumes your Region has center: [lat, lon]
        [54.5, -2.5] // final UK fallback
    }}
    route={selectedRoute as any}
  />
)}
    </div>
  );
}