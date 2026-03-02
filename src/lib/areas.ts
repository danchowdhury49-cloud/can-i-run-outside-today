export type Area = {
    slug: string;
    name: string;
    regionSlug: string;
  
    // [minLon, minLat, maxLon, maxLat] — optional but enables proper zoom
    bbox?: [number, number, number, number];
  };
  
  // Keep this list small for now, then expand.
  // IMPORTANT: These slugs must match route.areaSlug values.
  export const AREAS: Area[] = [
    // London (example breakdown)
    {
      slug: "london-central",
      name: "Central London",
      regionSlug: "london",
      bbox: [-0.18, 51.48, -0.05, 51.53]
    },
    {
      slug: "london-west",
      name: "West London",
      regionSlug: "london",
      bbox: [-0.30, 51.45, -0.12, 51.55]
    },
  
    // North West (example breakdown)
    {
      slug: "nw-manchester",
      name: "Manchester",
      regionSlug: "north-west",
      bbox: [-2.35, 53.36, -2.16, 53.55]
    },
    {
      slug: "nw-liverpool",
      name: "Liverpool",
      regionSlug: "north-west",
      bbox: [-3.05, 53.34, -2.86, 53.47]
    },
    {
      slug: "nw-chester",
      name: "Chester",
      regionSlug: "north-west",
      bbox: [-3.05, 53.12, -2.79, 53.27]
    }
  ];
  
  export function getAreasForRegion(regionSlug: string): Area[] {
    return AREAS.filter((a) => a.regionSlug === regionSlug);
  }
  
  export function getAreaBySlug(slug: string): Area | undefined {
    return AREAS.find((a) => a.slug === slug);
  }