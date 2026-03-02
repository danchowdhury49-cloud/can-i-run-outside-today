import { notFound } from "next/navigation";
import { HomeView } from "@/components/HomeView";
import { getRegionBySlug } from "@/lib/regions";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ focus?: string }>;
};

export default async function RegionDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = (await searchParams) ?? {};

  const region = getRegionBySlug(slug);
  if (!region) return notFound();

  return (
    <HomeView
      initialRegionSlug={region.slug}
      initialAutoFit={true}
      initialFocusAreaSlug={sp.focus}
    />
  );
}