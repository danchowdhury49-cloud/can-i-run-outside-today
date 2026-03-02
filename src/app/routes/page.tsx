import { REGIONS } from "@/lib/regions";
import { ROUTE_STUBS } from "@/lib/routes-data";
import { AREAS, getAreasForRegion } from "@/lib/areas";

type RouteStub = (typeof ROUTE_STUBS)[number];

function groupByArea(routes: RouteStub[]) {
  const map = new Map<string, RouteStub[]>();
  for (const r of routes) {
    // We support both old and new data while you migrate:
    const key = (r as any).areaSlug ?? "__no_area__";
    const existing = map.get(key) ?? [];
    existing.push(r);
    map.set(key, existing);
  }
  return map;
}

export default function RoutesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Routes (early beta)
        </h1>
        <p className="text-sm text-slate-600">
          Curated inspiration for popular runs. Next step is breaking each region
          into local areas (cities / boroughs) so London isn’t “one blob”.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {REGIONS.map((region) => {
          const regionRoutes = ROUTE_STUBS.filter(
            (r) => (r as any).regionSlug === region.slug
          );

          const areas = getAreasForRegion(region.slug);

          // group routes by areaSlug (new) or "__no_area__" (legacy)
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

              {/* If you haven’t migrated routes to areaSlug yet */}
              {areas.length === 0 && (
                <p className="text-xs text-slate-600">
                  Areas coming soon for this region. (We’ll split it into cities /
                  boroughs, then attach routes to each.)
                </p>
              )}

              {/* Areas list */}
              {areas.length > 0 && (
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
                            Routes coming soon for {area.name}. (Add 5–10 to make
                            it feel properly useful.)
                          </p>
                        ) : (
                          <ul className="mt-2 space-y-2 text-xs">
                            {areaRoutes.map((route) => (
                              <li
                                key={route.id}
                                className="rounded-xl bg-skysoft/60 p-2"
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
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}

                  {/* Legacy bucket (routes without areaSlug) */}
                  {byArea.has("__no_area__") && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-2">
                      <div className="text-xs font-semibold text-slate-900">
                        Needs area assignment
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600">
                        These routes still only have <code>regionSlug</code>.
                        Add an <code>areaSlug</code> to each route so they appear
                        under the right city/borough.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <p className="mt-2 text-[11px] text-slate-500">
                Next: add more routes per area + tags (flat, lit, sheltered,
                trail, parkrun-friendly) so this feels like a proper runner tool.
              </p>
            </section>
          );
        })}
      </div>
    </div>
  );
}