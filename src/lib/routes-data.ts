export type RouteStub = {
  id: string;
  name: string;
  regionSlug: string;
  distanceKm: number;
  terrain: "Road" | "Trail" | "Mixed";
  vibe: string;
  notes: string;
};

export const ROUTE_STUBS: RouteStub[] = [
  {
    id: "london-hyde-park-classic",
    regionSlug: "london",
    name: "Hyde Park loop",
    distanceKm: 7.2,
    terrain: "Road",
    vibe: "Flat, scenic, and full of other people pretending it’s an easy day.",
    notes: "Mix of paths and pavements, easy to extend via Kensington Gardens."
  },
  {
    id: "london-river-thames-easy",
    regionSlug: "london",
    name: "Thames easy out-and-back",
    distanceKm: 10,
    terrain: "Road",
    vibe: "Classic river views, mild tourist dodging required.",
    notes: "Pick a bridge as your turnaround; watch for busy sections near landmarks."
  },
  {
    id: "south-east-brighton-front",
    regionSlug: "south-east",
    name: "Brighton seafront breeze check",
    distanceKm: 8,
    terrain: "Road",
    vibe: "Wind-graded tempo depending on direction.",
    notes: "Out-and-back along the promenade; exposure makes wind forecasts very real."
  },
  {
    id: "south-west-bristol-downs",
    regionSlug: "south-west",
    name: "Bristol Downs and suspension bridge",
    distanceKm: 9,
    terrain: "Road",
    vibe: "Iconic views with rolling effort.",
    notes: "Looping options on the Downs; mind the climb back up if you drop to the river."
  },
  {
    id: "north-west-parkrun-tour",
    regionSlug: "north-west",
    name: "North West parkrun sampler",
    distanceKm: 5,
    terrain: "Mixed",
    vibe: "Soft underfoot in places; ideal for tempo parkrun fantasies.",
    notes: "Think Heaton Park / South Manchester style routes with both tarmac and path."
  },
  {
    id: "scotland-central-canal",
    regionSlug: "scotland-central-belt",
    name: "Canal path cruise",
    distanceKm: 12,
    terrain: "Trail",
    vibe: "Flat and steady, perfect for easy miles or controlled tempos.",
    notes: "Watch for mud after rain; shelter improves when it’s windy."
  },
  {
    id: "wales-bay-run",
    regionSlug: "wales-south",
    name: "Cardiff Bay loop-ish",
    distanceKm: 10.5,
    terrain: "Road",
    vibe: "Sea air and long straights, good for rhythm.",
    notes: "Can feel exposed in strong winds; great at sunrise or sunset."
  }
];

