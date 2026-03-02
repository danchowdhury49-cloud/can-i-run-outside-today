import { notFound } from "next/navigation";
import Link from "next/link";
import { getRegionBySlug } from "@/lib/regions";
import { getAreasForRegion, type Area } from "@/lib/areas";
import { ROUTE_STUBS } from "@/lib/routes-data";

type RouteStub = (typeof ROUTE_STUBS)[number];

type PageProps = {
  params: Promise<{ slug: string }>;
};

function groupByArea(routes: RouteStub[]) {
  const map = new Map<string, RouteStub[]>();
  for (const r of routes) {
    const existing = map.get(r.areaSlug) ?? [];
    existing.push(r);
    map.set(r.areaSlug, existing);
  }
  return map;
}

export default async function RegionRoutesByAreaPage({ params }: PageProps) {
  const { slug } = await params;

  const region = getRegionBySlug(slug);
  if (!region) return notFound();

  const areas = getAreasForRegion(region.slug);
  const regionRoutes = ROUTE_STUBS.filter((r) => r.regionSlug === region.slug);
  const byArea = groupByArea(regionRoutes);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {region.name} routes by area
          </h1>
          <p className="text-sm text-slate-600">
            Pick an area to see local routes. (This is the “less vague” view.)
          </p>
        </div>

        <Link
          href="/routes"
          className="rounded-full border border-sky-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
        >
          View all UK routes
        </Link>
      </div>

      {areas.length === 0 ? (
        <div className="rounded-2xl border border-sky-200 bg-white/80 p-3 text-sm text-slate-700">
          Areas haven’t been added for this region yet.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {areas.map((area: Area) => {
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
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}