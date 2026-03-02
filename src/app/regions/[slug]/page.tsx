import { notFound } from "next/navigation";
import { HomeView } from "@/components/HomeView";
import { getRegionBySlug } from "@/lib/regions";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RegionDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const region = getRegionBySlug(slug);
  if (!region) return notFound();

  return <HomeView initialRegionSlug={region.slug} />;
}