import { REGIONS } from "@/lib/regions";
import { ROUTE_STUBS } from "@/lib/routes-data";
import { getAreasForRegion } from "@/lib/areas";
import { RoutesClient } from "./routes-client";

export const dynamic = "force-dynamic";

export default function RoutesPage() {
  // build “areasByRegionSlug” for the client
  const areasByRegion = Object.fromEntries(
    REGIONS.map((r) => [r.slug, getAreasForRegion(r.slug)])
  );

  return (
    <RoutesClient
      regions={REGIONS}
      routes={ROUTE_STUBS}
      areasByRegion={areasByRegion}
    />
  );
}