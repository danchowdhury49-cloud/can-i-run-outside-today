import { notFound } from "next/navigation";
import { getRegionBySlug } from "@/lib/regions";
import { ROUTE_STUBS } from "@/lib/routes-data";
import { getAreasForRegion } from "@/lib/areas";

// ✅ Use a relative import to avoid "@/..." alias resolution issues here
import { RegionRoutesClient } from "../../../../components/RegionRoutesClient";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { slug: string };
};

export default async function RegionRoutesPage({ params }: PageProps) {
  const { slug } = params;

  const region = getRegionBySlug(slug);
  if (!region) return notFound();

  const areas = getAreasForRegion(region.slug);
  const regionRoutes = ROUTE_STUBS.filter((r) => r.regionSlug === region.slug);

  return <RegionRoutesClient region={region} areas={areas} routes={regionRoutes} />;
}