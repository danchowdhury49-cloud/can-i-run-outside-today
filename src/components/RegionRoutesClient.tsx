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
  region: Region;
  areas: Area[];
  routes: RouteStub[];
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

export function RegionRoutesClient({ region, areas, routes }: Props) {
  const byArea = useMemo(() => groupByArea(routes), [routes]);

  const [open, setOpen] = useState(false);
  const [selectedAreaSlug, setSelectedAreaSlug] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const selectedArea = useMemo(() => {
    if (!selectedAreaSlug) return null;
    return areas.find((a) => a.slug === selectedAreaSlug) ?? null;
  }, [areas, selectedAreaSlug]);

  const selectedRoute = useMemo(() => {
    if (!selectedRouteId) return null;
    return routes.find((r) => r.id === selectedRouteId) ?? null;
  }, [routes, selectedRouteId]);

  function openRoute(areaSlug: string, routeId: string) {
    // DEBUG: if you don't see this, you're not on the right page/component
    alert(`Clicked route: ${routeId}`);

    setSelectedAreaSlug(areaSlug);
    setSelectedRouteId(routeId);
    setOpen(true);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          {region.name} routes
        </h1>
        <p className="text-sm text-slate-600">
          Click any route to open details.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {areas.map((area) => {
          const areaRoutes = byArea.get(area.slug) ?? [];
          return (
            <section
              key={area.slug}
              className="rounded-2xl border border-sky-200 bg-white/80 p-3 shadow-sm"
            >
              <div className="mb-1 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  {area.name}
                </h2>
                <span className="rounded-full bg-skysoft px-2 py-0.5 text-[11px] text-slate-700">
                  {areaRoutes.length} routes
                </span>
              </div>

              {areaRoutes.length === 0 ? (
                <p className="text-xs text-slate-600">Routes coming soon.</p>
              ) : (
                <ul className="mt-2 space-y-2 text-xs">
                  {areaRoutes.map((route) => (
                    <li key={route.id} className="rounded-xl bg-skysoft/60 p-2">
                      <button
                        type="button"
                        onClick={() => openRoute(area.slug, route.id)}
                        className="block w-full text-left cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-medium text-slate-900">
                            {route.name}
                          </div>
                          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-slate-700">
                            {route.distanceKm.toFixed(1)} km · {route.terrain}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-700">{route.vibe}</p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {route.notes}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {/* Modal */}
      {selectedArea && selectedRoute && (
        <RouteDetailsModal
          open={open}
          onClose={() => setOpen(false)}
          regionSlug={region.slug}
          area={selectedArea as any}
          route={selectedRoute as any}
        />
      )}
    </div>
  );
}