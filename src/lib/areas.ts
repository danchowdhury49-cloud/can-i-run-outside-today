// src/lib/areas.ts

export type Area = {
    slug: string;
    name: string;
    regionSlug: string;
  };
  
  export const AREAS: Area[] = [
    // London
    { slug: "london-central", name: "Central London", regionSlug: "london" },
    { slug: "london-north", name: "North London", regionSlug: "london" },
    { slug: "london-east", name: "East London", regionSlug: "london" },
    { slug: "london-south", name: "South London", regionSlug: "london" },
    { slug: "london-west", name: "West London", regionSlug: "london" },
  
    // North West
    { slug: "nw-manchester", name: "Manchester", regionSlug: "north-west" },
    { slug: "nw-liverpool", name: "Liverpool", regionSlug: "north-west" },
    { slug: "nw-chester", name: "Chester", regionSlug: "north-west" },
    { slug: "nw-preston", name: "Preston", regionSlug: "north-west" },
    { slug: "nw-blackpool", name: "Blackpool", regionSlug: "north-west" },
    { slug: "nw-warrington", name: "Warrington", regionSlug: "north-west" },
  
    // South East
    { slug: "se-brighton", name: "Brighton", regionSlug: "south-east" },
    { slug: "se-oxford", name: "Oxford", regionSlug: "south-east" },
    { slug: "se-reading", name: "Reading", regionSlug: "south-east" },
    { slug: "se-canterbury", name: "Canterbury", regionSlug: "south-east" },
  
    // South West
    { slug: "sw-bristol", name: "Bristol", regionSlug: "south-west" },
    { slug: "sw-bath", name: "Bath", regionSlug: "south-west" },
    { slug: "sw-exeter", name: "Exeter", regionSlug: "south-west" },
    { slug: "sw-plymouth", name: "Plymouth", regionSlug: "south-west" },
  
    // Scotland (Central Belt)
    { slug: "scot-glasgow", name: "Glasgow", regionSlug: "scotland-central-belt" },
    { slug: "scot-edinburgh", name: "Edinburgh", regionSlug: "scotland-central-belt" },
  
    // Wales (South)
    { slug: "wales-cardiff", name: "Cardiff", regionSlug: "wales-south" },
    { slug: "wales-swansea", name: "Swansea", regionSlug: "wales-south" }
  ];
  
  export function getAreasForRegion(regionSlug: string): Area[] {
    return AREAS.filter((a) => a.regionSlug === regionSlug);
  }
  
  export function getAreaBySlug(areaSlug: string): Area | undefined {
    return AREAS.find((a) => a.slug === areaSlug);
  }