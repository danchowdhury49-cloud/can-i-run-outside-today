export type RouteStub = {
  id: string;
  name: string;

  // keep regionSlug (useful for grouping + future)
  regionSlug: string;

  // NEW: drills down within region (city/borough/area)
  areaSlug: string;

  distanceKm: number;
  terrain: "Road" | "Trail" | "Mixed";
  vibe: string;
  notes: string;
};

export const ROUTE_STUBS: RouteStub[] = [
  // ============================================================
  // LONDON (split into Central / North / East / South / West)
  // ============================================================
  {
    id: "london-hyde-park-classic",
    regionSlug: "london",
    areaSlug: "london-west",
    name: "Hyde Park loop",
    distanceKm: 7.2,
    terrain: "Road",
    vibe: "Flat, scenic, and full of other people pretending it’s an easy day.",
    notes: "Mix of paths and pavements; easy to extend via Kensington Gardens."
  },
  {
    id: "london-thames-easy",
    regionSlug: "london",
    areaSlug: "london-central",
    name: "Thames easy out-and-back",
    distanceKm: 10,
    terrain: "Road",
    vibe: "Classic river views, mild tourist dodging required.",
    notes: "Pick a bridge as your turnaround; busiest near landmark sections."
  },
  {
    id: "london-regents-canal",
    regionSlug: "london",
    areaSlug: "london-north",
    name: "Regent’s Canal cruise",
    distanceKm: 8.5,
    terrain: "Mixed",
    vibe: "Steady, flat-ish miles with a calm, ‘just keep ticking’ vibe.",
    notes: "Good for easy runs; watch for cyclists and narrow towpath sections."
  },
  {
    id: "london-victoria-park-laps",
    regionSlug: "london",
    areaSlug: "london-east",
    name: "Victoria Park steady laps",
    distanceKm: 6,
    terrain: "Road",
    vibe: "Park laps that feel like training, not sightseeing.",
    notes: "Great for tempos or progression runs; add laps to taste."
  },
  {
    id: "london-burgess-park",
    regionSlug: "london",
    areaSlug: "london-south",
    name: "Burgess Park loops",
    distanceKm: 7,
    terrain: "Mixed",
    vibe: "Low-fuss route for ‘get it done’ days.",
    notes: "Paths + pavements; easy to extend toward Southwark / Peckham."
  },

  // ============================================================
  // SOUTH EAST (Brighton / Oxford / Reading / Canterbury)
  // ============================================================
  {
    id: "south-east-brighton-front",
    regionSlug: "south-east",
    areaSlug: "se-brighton",
    name: "Brighton seafront breeze check",
    distanceKm: 8,
    terrain: "Road",
    vibe: "Wind-graded tempo depending on direction.",
    notes: "Out-and-back along the promenade; exposure makes wind forecasts very real."
  },
  {
    id: "south-east-brighton-marina",
    regionSlug: "south-east",
    areaSlug: "se-brighton",
    name: "Brighton → Marina out-and-back",
    distanceKm: 10,
    terrain: "Road",
    vibe: "Sea views, long straights, ‘lock in and cruise’.",
    notes: "Busy at peak times; sunrise runs hit different."
  },
  {
    id: "south-east-oxford-riverside",
    regionSlug: "south-east",
    areaSlug: "se-oxford",
    name: "Oxford riverside easy miles",
    distanceKm: 9,
    terrain: "Mixed",
    vibe: "Quiet, flat, and extremely ‘Sunday morning’.",
    notes: "Can be muddy after rain; great for relaxed aerobic runs."
  },
  {
    id: "south-east-reading-thames",
    regionSlug: "south-east",
    areaSlug: "se-reading",
    name: "Reading Thames path cruise",
    distanceKm: 11,
    terrain: "Mixed",
    vibe: "Steady effort, minimal hills, easy pacing.",
    notes: "Watch footing after rain; great for longer steady runs."
  },
  {
    id: "south-east-canterbury-city-loop",
    regionSlug: "south-east",
    areaSlug: "se-canterbury",
    name: "Canterbury park-and-river loop",
    distanceKm: 7.5,
    terrain: "Road",
    vibe: "A tidy loop that feels ‘local runner approved’.",
    notes: "Mix of paths and streets; add distance by extending along the river."
  },

  // ============================================================
  // SOUTH WEST (Bristol / Bath / Exeter / Plymouth)
  // ============================================================
  {
    id: "south-west-bristol-downs",
    regionSlug: "south-west",
    areaSlug: "sw-bristol",
    name: "Bristol Downs and suspension bridge",
    distanceKm: 9,
    terrain: "Road",
    vibe: "Iconic views with rolling effort.",
    notes: "Loop options on the Downs; mind the climb back up if you drop to the river."
  },
  {
    id: "south-west-bristol-harbour",
    regionSlug: "south-west",
    areaSlug: "sw-bristol",
    name: "Harbourside easy loop",
    distanceKm: 6.8,
    terrain: "Road",
    vibe: "Flat-ish and forgiving—good for easy days.",
    notes: "Popular paths; go early if you want fewer obstacles."
  },
  {
    id: "south-west-bath-canal",
    regionSlug: "south-west",
    areaSlug: "sw-bath",
    name: "Bath canal path steady run",
    distanceKm: 10,
    terrain: "Trail",
    vibe: "Relaxed towpath miles with minimal elevation drama.",
    notes: "Can be slippery after rain; bring traction confidence."
  },
  {
    id: "south-west-exeter-riverside",
    regionSlug: "south-west",
    areaSlug: "sw-exeter",
    name: "Exeter riverside out-and-back",
    distanceKm: 12,
    terrain: "Mixed",
    vibe: "Long, steady, and perfect for marathon-brain runs.",
    notes: "Great for controlled steady effort; watch shared-use sections."
  },
  {
    id: "south-west-plymouth-hoe",
    regionSlug: "south-west",
    areaSlug: "sw-plymouth",
    name: "Plymouth Hoe coastal loop",
    distanceKm: 8.2,
    terrain: "Road",
    vibe: "Sea air + open skies + mild wind roulette.",
    notes: "Exposed in gusts; but the views repay the suffering."
  },

  // ============================================================
  // NORTH WEST (Manchester / Liverpool / Chester / Preston / Blackpool / Warrington)
  // ============================================================
  {
    id: "north-west-manchester-heaton-park",
    regionSlug: "north-west",
    areaSlug: "nw-manchester",
    name: "Heaton Park loop(s)",
    distanceKm: 7.5,
    terrain: "Mixed",
    vibe: "Big park energy: steady loops, easy pacing, lots of runners.",
    notes: "Good for tempos with controlled effort; extend with extra laps."
  },
  {
    id: "north-west-manchester-canal",
    regionSlug: "north-west",
    areaSlug: "nw-manchester",
    name: "Canal towpath cruise",
    distanceKm: 10,
    terrain: "Trail",
    vibe: "Flat miles that make you feel suspiciously efficient.",
    notes: "Watch for narrow towpath sections; mud after rain."
  },
  {
    id: "north-west-liverpool-sefton-park",
    regionSlug: "north-west",
    areaSlug: "nw-liverpool",
    name: "Sefton Park steady laps",
    distanceKm: 6,
    terrain: "Road",
    vibe: "Park laps with a ‘proper session’ feel.",
    notes: "Easy to stack laps for longer runs; great for tempo pacing."
  },
  {
    id: "north-west-liverpool-docks",
    regionSlug: "north-west",
    areaSlug: "nw-liverpool",
    name: "Albert Dock / waterfront out-and-back",
    distanceKm: 9,
    terrain: "Road",
    vibe: "Flat waterfront miles—great for cruising.",
    notes: "Can be windy and busy; early runs are best."
  },
  {
    id: "north-west-chester-canal-towpath",
    regionSlug: "north-west",
    areaSlug: "nw-chester",
    name: "Chester canal towpath (Hoole-friendly)",
    distanceKm: 8,
    terrain: "Trail",
    vibe: "Flat, calming, and ideal for ‘head empty, legs moving’.",
    notes: "Good from Hoole area; can be muddy after rain—choose shoes accordingly."
  },
  {
    id: "north-west-chester-river-dee",
    regionSlug: "north-west",
    areaSlug: "nw-chester",
    name: "River Dee loop",
    distanceKm: 10,
    terrain: "Mixed",
    vibe: "Scenic river miles with a steady rhythm.",
    notes: "Mix of paths and sections that can get busy on weekends."
  },
  {
    id: "north-west-preston-avenham",
    regionSlug: "north-west",
    areaSlug: "nw-preston",
    name: "Avenham & Miller Park loop",
    distanceKm: 7,
    terrain: "Road",
    vibe: "Park loop with enough variation to stay interesting.",
    notes: "Add laps or extend toward riverside paths."
  },
  {
    id: "north-west-blackpool-prom",
    regionSlug: "north-west",
    areaSlug: "nw-blackpool",
    name: "Blackpool prom out-and-back",
    distanceKm: 10,
    terrain: "Road",
    vibe: "Dead-flat miles, wind makes it spicy.",
    notes: "Great for steady pacing; pick direction based on wind."
  },
  {
    id: "north-west-warrington-riverside",
    regionSlug: "north-west",
    areaSlug: "nw-warrington",
    name: "Riverside steady run",
    distanceKm: 9,
    terrain: "Mixed",
    vibe: "Low-fuss local route for consistent training.",
    notes: "Good for easy miles; shared paths at busy times."
  },

  // ============================================================
  // SCOTLAND (Central Belt) — your slug is scotland-central-belt
  // ============================================================
  {
    id: "scotland-central-canal",
    regionSlug: "scotland-central-belt",
    areaSlug: "scot-glasgow",
    name: "Canal path cruise",
    distanceKm: 12,
    terrain: "Trail",
    vibe: "Flat and steady, perfect for easy miles or controlled tempos.",
    notes: "Watch for mud after rain; shelter improves when it’s windy."
  },
  {
    id: "scotland-edinburgh-meadows",
    regionSlug: "scotland-central-belt",
    areaSlug: "scot-edinburgh",
    name: "The Meadows laps",
    distanceKm: 6.5,
    terrain: "Road",
    vibe: "Classic ‘locals doing a session’ energy.",
    notes: "Great for tempos; add laps to hit your distance."
  },
  {
    id: "scotland-glasgow-green",
    regionSlug: "scotland-central-belt",
    areaSlug: "scot-glasgow",
    name: "Glasgow Green steady loop",
    distanceKm: 8,
    terrain: "Road",
    vibe: "Simple, flat, and very runnable.",
    notes: "Good for easy runs or controlled steady efforts."
  },

  // ============================================================
  // WALES (South) — your slug is wales-south
  // ============================================================
  {
    id: "wales-bay-run",
    regionSlug: "wales-south",
    areaSlug: "wales-cardiff",
    name: "Cardiff Bay loop-ish",
    distanceKm: 10.5,
    terrain: "Road",
    vibe: "Sea air and long straights, good for rhythm.",
    notes: "Can feel exposed in strong winds; great at sunrise or sunset."
  },
  {
    id: "wales-cardiff-park",
    regionSlug: "wales-south",
    areaSlug: "wales-cardiff",
    name: "Bute Park easy loops",
    distanceKm: 7.2,
    terrain: "Mixed",
    vibe: "Parkland miles that feel calm and repeatable.",
    notes: "Good for easy days; extend with extra laps."
  },
  {
    id: "wales-swansea-bay",
    regionSlug: "wales-south",
    areaSlug: "wales-swansea",
    name: "Swansea Bay out-and-back",
    distanceKm: 9,
    terrain: "Road",
    vibe: "Flat coastal miles, wind dependent difficulty.",
    notes: "Best early; exposed if gusty."
  }
];