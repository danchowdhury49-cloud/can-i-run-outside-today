import { notFound } from "next/navigation";
import { getRegionBySlug } from "@/lib/regions";
import { ROUTE_STUBS } from "@/lib/routes-data";
import { getAreasForRegion } from "@/lib/areas";

// Keep this relative import if your alias resolution was flaky
import { RegionRoutesClient } from "../../../../components/RegionRoutesClient";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RegionRoutesPage({ params }: PageProps) {
  const { slug } = await params;

  const region = getRegionBySlug(slug);
  if (!region) return notFound();

  const areas = getAreasForRegion(region.slug);
  const regionRoutes = ROUTE_STUBS.filter((r) => r.regionSlug === region.slug);

  return <RegionRoutesClient region={region} areas={areas} routes={regionRoutes} />;
}