import { REGIONS } from "@/lib/regions";
import { ROUTE_STUBS } from "@/lib/routes-data";

export default function RoutesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Routes (early beta)</h1>
        <p className="text-sm text-slate-600">
          Curated placeholders for popular runs in each region. No GPX files yet;
          think of this as inspiration more than precise navigation.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {REGIONS.map((region) => {
          const regionRoutes = ROUTE_STUBS.filter(
            (r) => r.regionSlug === region.slug
          );
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
              {regionRoutes.length === 0 ? (
                <p className="text-xs text-slate-600">
                  Routes coming soon. For now, your local parkrun is always a good bet.
                </p>
              ) : (
                <ul className="mt-1 space-y-2 text-xs">
                  {regionRoutes.map((route) => (
                    <li key={route.id} className="rounded-xl bg-skysoft/60 p-2">
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
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-[11px] text-slate-500">
                Iteration 2: we&apos;ll add richer route details and optional
                GPX exports.
              </p>
            </section>
          );
        })}
      </div>
    </div>
  );
}

