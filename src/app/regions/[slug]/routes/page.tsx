import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegionBySlug } from "@/lib/regions";
import { ROUTE_STUBS } from "@/lib/routes-data";
import { getAreasForRegion, type Area } from "@/lib/areas";

type RouteStub = (typeof ROUTE_STUBS)[number];

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
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

export default async function RegionRoutesPage({ params }: PageProps) {
  const { slug } = await params;

  const region = getRegionBySlug(slug);
  if (!region) return notFound();

  const regionRoutes = ROUTE_STUBS.filter((r) => r.regionSlug === region.slug);
  const areas: Area[] = getAreasForRegion(region.slug);
  const byArea = groupByArea(regionRoutes);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {region.name} routes
          </h1>
          <p className="text-sm text-slate-600">
            Pick an area for curated routes. Clicking a route will jump you to the map.
          </p>
        </div>

        <Link
          href={`/regions/${region.slug}`}
          className="rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-primary"
        >
          View map
        </Link>
      </div>

      {areas.length === 0 ? (
        <div className="rounded-2xl border border-sky-200 bg-white/80 p-3 text-sm shadow-sm">
          <div className="font-semibold text-slate-900">Areas coming soon</div>
          <p className="mt-1 text-xs text-slate-600">
            This region hasn’t been split into areas yet. Add areas in{" "}
            <code>src/lib/areas.ts</code>.
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
                      <li
                        key={route.id}
                        className="rounded-xl bg-skysoft/60 p-2"
                      >
                        <Link
  href={`/regions/${region.slug}?area=${encodeURIComponent(area.slug)}`}
  className="block"
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
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}

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
    </div>
  );
}