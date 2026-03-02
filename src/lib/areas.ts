export type Area = {
    slug: string;
    name: string;
    regionSlug: string;
  
    // [minLon, minLat, maxLon, maxLat] — enables map zoom later
    bbox?: [number, number, number, number];
  };
  
  export const AREAS: Area[] = [
    // ======================
    // LONDON
    // ======================
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
    {
      slug: "london-east",
      name: "East London",
      regionSlug: "london",
      bbox: [-0.10, 51.49, 0.08, 51.58]
    },
    {
      slug: "london-south",
      name: "South London",
      regionSlug: "london",
      bbox: [-0.25, 51.40, 0.05, 51.49]
    },
  
    // ======================
    // NORTH WEST
    // ======================
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
    },
  
    // ======================
    // SOUTH EAST
    // (Brighton, Kent, Surrey, Oxford/Cambridge-ish depending on your definition)
    // ======================
    {
      slug: "se-brighton",
      name: "Brighton & Hove",
      regionSlug: "south-east",
      bbox: [-0.20, 50.80, 0.05, 50.88]
    },
    {
      slug: "se-kent",
      name: "Kent (Canterbury / Margate)",
      regionSlug: "south-east",
      bbox: [0.55, 51.10, 1.45, 51.45]
    },
    {
      slug: "se-surrey",
      name: "Surrey Hills",
      regionSlug: "south-east",
      bbox: [-0.65, 51.05, -0.15, 51.35]
    },
    {
      slug: "se-oxford",
      name: "Oxford",
      regionSlug: "south-east",
      bbox: [-1.35, 51.70, -1.18, 51.80]
    },
    {
      slug: "se-cambridge",
      name: "Cambridge",
      regionSlug: "south-east",
      bbox: [0.05, 52.16, 0.20, 52.24]
    },
  
    // ======================
    // SOUTH WEST
    // ======================
    {
      slug: "sw-bristol",
      name: "Bristol",
      regionSlug: "south-west",
      bbox: [-2.75, 51.40, -2.50, 51.52]
    },
    {
      slug: "sw-bath",
      name: "Bath",
      regionSlug: "south-west",
      bbox: [-2.45, 51.35, -2.30, 51.42]
    },
    {
      slug: "sw-exeter",
      name: "Exeter",
      regionSlug: "south-west",
      bbox: [-3.60, 50.68, -3.45, 50.76]
    },
    {
      slug: "sw-bournemouth",
      name: "Bournemouth",
      regionSlug: "south-west",
      bbox: [-1.95, 50.70, -1.78, 50.77]
    },
  
    // ======================
    // SCOTLAND (Central Belt)
    // ======================
    {
      slug: "scot-glasgow",
      name: "Glasgow",
      regionSlug: "scotland-central-belt",
      bbox: [-4.35, 55.81, -4.15, 55.92]
    },
    {
      slug: "scot-edinburgh",
      name: "Edinburgh",
      regionSlug: "scotland-central-belt",
      bbox: [-3.30, 55.90, -3.10, 55.99]
    },
    {
      slug: "scot-stirling",
      name: "Stirling",
      regionSlug: "scotland-central-belt",
      bbox: [-3.98, 56.09, -3.85, 56.14]
    },
  
    // ======================
    // WALES (South)
    // ======================
    {
      slug: "wales-cardiff",
      name: "Cardiff",
      regionSlug: "wales-south",
      bbox: [-3.30, 51.44, -3.05, 51.55]
    },
    {
      slug: "wales-swansea",
      name: "Swansea",
      regionSlug: "wales-south",
      bbox: [-4.10, 51.58, -3.85, 51.68]
    },
    {
      slug: "wales-newport",
      name: "Newport",
      regionSlug: "wales-south",
      bbox: [-3.05, 51.54, -2.90, 51.62]
    }
  ];
  
  export function getAreasForRegion(regionSlug: string): Area[] {
    return AREAS.filter((a) => a.regionSlug === regionSlug);
  }
  
  export function getAreaBySlug(slug: string): Area | undefined {
    return AREAS.find((a) => a.slug === slug);
  }