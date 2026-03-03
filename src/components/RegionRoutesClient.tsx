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
  coordinates?: [number, number][]; // optional mini-map line
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
    setSelectedAreaSlug(areaSlug);
    setSelectedRouteId(routeId);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          {region.name} routes
        </h1>
        <p className="text-sm text-slate-600">
          Click any route to open details (mini map + current weather + best run windows).
        </p>
      </div>

      {areas.length === 0 ? (
        <div className="rounded-2xl border border-sky-200 bg-white/80 p-3 text-sm shadow-sm">
          <div className="font-semibold text-slate-900">Areas coming soon</div>
          <p className="mt-1 text-xs text-slate-600">
            This region hasn’t been split into areas yet.
          </p>
        </div>
      ) : (
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
                  <p className="text-xs text-slate-600">
                    Routes coming soon for {area.name}.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2 text-xs">
                    {areaRoutes.map((route) => (
                      <li key={route.id} className="rounded-xl bg-skysoft/60 p-2">
                        <button
                          type="button"
                          onClick={() => openRoute(area.slug, route.id)}
                          className="block w-full text-left"
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
                          <p className="mt-2 text-[11px] font-semibold text-primary">
                            Tap for details →
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
      )}

      {/* Legacy bucket warning */}
      {byArea.has("__no_area__") && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3">
          <div className="text-sm font-semibold text-slate-900">
            Needs area assignment
          </div>
          <p className="mt-1 text-xs text-slate-700">
            Some routes only have <code>regionSlug</code>. Add <code>areaSlug</code>{" "}
            in <code>src/lib/routes-data.ts</code> so they show under the right area.
          </p>
        </div>
      )}

      {/* The actual popup */}
      {selectedArea && selectedRoute && (
        <RouteDetailsModal
          open={open}
          onClose={closeModal}
          regionSlug={region.slug}
          area={selectedArea as any}
          route={selectedRoute as any}
        />
      )}
    </div>
  );
}