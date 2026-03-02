export type SamplePoint = {
  name: string;
  lat: number;
  lon: number;
};

export type Region = {
  slug: string;
  name: string;
  center: [number, number]; // [lat, lon]
  bbox: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  samplePoints: SamplePoint[];
};

export const REGIONS: Region[] = [
  {
    slug: "london",
    name: "London",
    center: [51.5074, -0.1278],
    bbox: [-0.5, 51.28, 0.3, 51.7],
    samplePoints: [
      { name: "Hyde Park", lat: 51.5073, lon: -0.1657 },
      { name: "Regent's Park", lat: 51.5313, lon: -0.1569 },
      { name: "Greenwich", lat: 51.4817, lon: 0.0054 },
      { name: "Richmond Park", lat: 51.4429, lon: -0.2736 },
      { name: "Olympic Park", lat: 51.544, lon: -0.0166 },
      { name: "Clapham Common", lat: 51.4581, lon: -0.1386 }
    ]
  },
  {
    slug: "south-east",
    name: "South East",
    center: [51.25, -0.8],
    bbox: [-1.8, 50.7, 0.9, 51.7],
    samplePoints: [
      { name: "Brighton", lat: 50.8225, lon: -0.1372 },
      { name: "Guildford", lat: 51.2362, lon: -0.5704 },
      { name: "Reading", lat: 51.4543, lon: -0.9781 },
      { name: "Canterbury", lat: 51.2798, lon: 1.0837 },
      { name: "Maidstone", lat: 51.2704, lon: 0.5227 }
    ]
  },
  {
    slug: "south-west",
    name: "South West",
    center: [51.0, -3.5],
    bbox: [-5.7, 50.2, -1.5, 51.7],
    samplePoints: [
      { name: "Bristol", lat: 51.4545, lon: -2.5879 },
      { name: "Bath", lat: 51.3813, lon: -2.359 },
      { name: "Exeter", lat: 50.7184, lon: -3.5339 },
      { name: "Plymouth", lat: 50.3755, lon: -4.1427 },
      { name: "Bournemouth", lat: 50.7192, lon: -1.8808 }
    ]
  },
  {
    slug: "north-west",
    name: "North West",
    center: [53.5, -2.5],
    bbox: [-3.6, 53.0, -2.0, 54.5],
    samplePoints: [
      { name: "Manchester", lat: 53.4808, lon: -2.2426 },
      { name: "Liverpool", lat: 53.4084, lon: -2.9916 },
      { name: "Preston", lat: 53.7632, lon: -2.7031 },
      { name: "Lancaster", lat: 54.047, lon: -2.8014 },
      { name: "Lake District (Windermere)", lat: 54.3801, lon: -2.9382 }
    ]
  },
  {
    slug: "scotland-central-belt",
    name: "Scotland (Central Belt)",
    center: [55.9, -3.5],
    bbox: [-4.8, 55.5, -2.9, 56.2],
    samplePoints: [
      { name: "Glasgow", lat: 55.8642, lon: -4.2518 },
      { name: "Edinburgh", lat: 55.9533, lon: -3.1883 },
      { name: "Stirling", lat: 56.1165, lon: -3.9369 },
      { name: "Falkirk", lat: 56.0019, lon: -3.7834 },
      { name: "Livingston", lat: 55.886, lon: -3.5203 }
    ]
  },
  {
    slug: "wales-south",
    name: "Wales (South)",
    center: [51.6, -3.3],
    bbox: [-4.6, 51.3, -2.5, 52.2],
    samplePoints: [
      { name: "Cardiff", lat: 51.4816, lon: -3.1791 },
      { name: "Swansea", lat: 51.6214, lon: -3.9436 },
      { name: "Newport", lat: 51.5842, lon: -2.9977 },
      { name: "Bridgend", lat: 51.505, lon: -3.577 },
      { name: "Merthyr Tydfil", lat: 51.7479, lon: -3.3778 }
    ]
  }
];

export function getRegionBySlug(slug: string): Region | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

