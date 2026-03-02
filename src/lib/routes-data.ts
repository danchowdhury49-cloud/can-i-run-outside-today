export type RouteStub = {
  id: string;
  name: string;
  regionSlug: string;

  // ✅ new (so routes appear under areas)
  areaSlug?: string;

  distanceKm: number;
  terrain: "Road" | "Trail" | "Mixed";
  vibe: string;
  notes: string;

  // ✅ optional: if you add coordinates later, the modal can draw the route line
  // lng/lat pairs
  coordinates?: [number, number][];
};

export const ROUTE_STUBS: RouteStub[] = [
  // ======================
  // LONDON — Central
  // ======================
  {
    id: "london-thames-central",
    regionSlug: "london",
    areaSlug: "london-central",
    name: "Thames easy out-and-back",
    distanceKm: 10,
    terrain: "Road",
    vibe: "Classic river views, mild tourist dodging required.",
    notes: "Pick a bridge as your turnaround; avoid peak landmark choke points."
  },
  {
    id: "london-regents-canal-central",
    regionSlug: "london",
    areaSlug: "london-central",
    name: "Regent’s Canal cruise",
    distanceKm: 8.5,
    terrain: "Mixed",
    vibe: "Flat, steady rhythm with little pockets of chaos.",
    notes: "Watch for cyclists + narrow sections; great for easy miles."
  },

  // London — West
  {
    id: "london-hyde-park-loop",
    regionSlug: "london",
    areaSlug: "london-west",
    name: "Hyde Park loop",
    distanceKm: 7.2,
    terrain: "Road",
    vibe: "Flat, scenic, and full of other people pretending it’s an easy day.",
    notes: "Easy to extend via Kensington Gardens; paths get busy weekends."
  },
  {
    id: "london-richmond-park-laps",
    regionSlug: "london",
    areaSlug: "london-west",
    name: "Richmond Park lap(s)",
    distanceKm: 10.6,
    terrain: "Road",
    vibe: "Rolling but runnable; feels like you’ve escaped London for an hour.",
    notes: "Add or subtract laps; deer are the unofficial marshals."
  },

  // London — East
  {
    id: "london-victoria-park",
    regionSlug: "london",
    areaSlug: "london-east",
    name: "Victoria Park loops",
    distanceKm: 6.2,
    terrain: "Road",
    vibe: "Fast, flat, and social — tempo-friendly.",
    notes: "Good lighting; easy to add miles via canal paths."
  },
  {
    id: "london-hackney-marshes",
    regionSlug: "london",
    areaSlug: "london-east",
    name: "Hackney Marshes & Lea",
    distanceKm: 9,
    terrain: "Mixed",
    vibe: "Open skies and long straights. Wind will have opinions.",
    notes: "Great when you want uninterrupted running; watch for muddy sections."
  },

  // London — South
  {
    id: "london-battersea-riverside",
    regionSlug: "london",
    areaSlug: "london-south",
    name: "Battersea + riverside link-up",
    distanceKm: 8,
    terrain: "Road",
    vibe: "Smooth and predictable — ideal for easy runs.",
    notes: "Loop Battersea then add river stretch; busy at lunch hour."
  },
  {
    id: "london-clapham-common",
    regionSlug: "london",
    areaSlug: "london-south",
    name: "Clapham Common reps-friendly loop",
    distanceKm: 5,
    terrain: "Road",
    vibe: "Short loop for strides, reps, and pretending you’re disciplined.",
    notes: "Good lighting; extend via nearby streets if it’s crowded."
  },

  // ======================
  // NORTH WEST — Manchester
  // ======================
  {
    id: "nw-mcr-heaton-park",
    regionSlug: "north-west",
    areaSlug: "nw-manchester",
    name: "Heaton Park loop(s)",
    distanceKm: 7.5,
    terrain: "Mixed",
    vibe: "Big park energy: steady loops, easy pacing, lots of runners.",
    notes: "Good for controlled effort; extend with extra laps."
  },
  {
    id: "nw-mcr-ship-canal",
    regionSlug: "north-west",
    areaSlug: "nw-manchester",
    name: "Canal towpath cruise",
    distanceKm: 10,
    terrain: "Trail",
    vibe: "Flat miles that make you feel suspiciously efficient.",
    notes: "Can be muddy after rain; great for easy/steady runs."
  },

  // North West — Liverpool
  {
    id: "nw-liv-sefton-park",
    regionSlug: "north-west",
    areaSlug: "nw-liverpool",
    name: "Sefton Park loop",
    distanceKm: 5.3,
    terrain: "Road",
    vibe: "Scenic and quick — a proper staple.",
    notes: "Add loops for longer runs; busy weekends."
  },
  {
    id: "nw-liv-waterfront",
    regionSlug: "north-west",
    areaSlug: "nw-liverpool",
    name: "Waterfront out-and-back",
    distanceKm: 8,
    terrain: "Road",
    vibe: "Open, flat, and a little breezy.",
    notes: "Wind can turn this into a workout; pick direction based on forecast."
  },

  // North West — Chester
  {
    id: "nw-chee-canal-hoole",
    regionSlug: "north-west",
    areaSlug: "nw-chester",
    name: "Hoole → Canal towpath",
    distanceKm: 8.2,
    terrain: "Trail",
    vibe: "Flat, calm, and very extendable.",
    notes: "Great easy-run route. Towpath can be soft after rain."
  },
  {
    id: "nw-chee-river-dee",
    regionSlug: "north-west",
    areaSlug: "nw-chester",
    name: "River Dee riverside",
    distanceKm: 10,
    terrain: "Mixed",
    vibe: "Scenic and relaxed with plenty of options to shorten/extend.",
    notes: "Busier on nice days; perfect for steady miles."
  },

  // ======================
  // SOUTH EAST — Brighton
  // ======================
  {
    id: "se-bri-seafront",
    regionSlug: "south-east",
    areaSlug: "se-brighton",
    name: "Brighton seafront breeze check",
    distanceKm: 8,
    terrain: "Road",
    vibe: "Wind-graded tempo depending on direction.",
    notes: "Out-and-back along the promenade; exposure makes wind very real."
  },
  {
    id: "se-bri-marina-out",
    regionSlug: "south-east",
    areaSlug: "se-brighton",
    name: "Palace Pier → Marina",
    distanceKm: 6.5,
    terrain: "Road",
    vibe: "Fast and flat. The sea judges your pacing.",
    notes: "Add extra miles by extending past the marina."
  },

  // South East — Kent
  {
    id: "se-kent-coastal",
    regionSlug: "south-east",
    areaSlug: "se-kent",
    name: "Coastal path sampler",
    distanceKm: 9,
    terrain: "Mixed",
    vibe: "Views for days; wind adds spice.",
    notes: "Surface varies; great for steady runs, not ideal for sharp reps."
  },
  {
    id: "se-kent-park-loop",
    regionSlug: "south-east",
    areaSlug: "se-kent",
    name: "Town park loops",
    distanceKm: 5,
    terrain: "Road",
    vibe: "Reliable and repeatable.",
    notes: "Use as a base and add loops; good for tempo blocks."
  },

  // South East — Surrey Hills
  {
    id: "se-surrey-trail-roller",
    regionSlug: "south-east",
    areaSlug: "se-surrey",
    name: "Surrey Hills trail roller",
    distanceKm: 11,
    terrain: "Trail",
    vibe: "Hilly and honest — strength builder.",
    notes: "Bring grippy shoes if it’s wet; keep effort easy on climbs."
  },
  {
    id: "se-surrey-mixed-loop",
    regionSlug: "south-east",
    areaSlug: "se-surrey",
    name: "Woodland mixed loop",
    distanceKm: 8,
    terrain: "Mixed",
    vibe: "Sheltered and calm — good when wind is annoying.",
    notes: "Some mud after rain; great easy run option."
  },

  // South East — Oxford
  {
    id: "se-ox-thames-path",
    regionSlug: "south-east",
    areaSlug: "se-oxford",
    name: "Thames Path steady",
    distanceKm: 10,
    terrain: "Trail",
    vibe: "Flat and peaceful — steady pace heaven.",
    notes: "Towpath can be soft; choose shoes accordingly."
  },
  {
    id: "se-ox-uni-loops",
    regionSlug: "south-east",
    areaSlug: "se-oxford",
    name: "City loop (quiet streets)",
    distanceKm: 7,
    terrain: "Road",
    vibe: "Smooth running, minimal interruptions if you pick the right time.",
    notes: "Early mornings are best; avoid peak pedestrian times."
  },

  // South East — Cambridge
  {
    id: "se-cam-river-cam",
    regionSlug: "south-east",
    areaSlug: "se-cambridge",
    name: "River Cam easy",
    distanceKm: 8,
    terrain: "Mixed",
    vibe: "Flat, scenic, and very extendable.",
    notes: "Busy in tourist zones; go early for a cleaner run."
  },
  {
    id: "se-cam-gog-magog",
    regionSlug: "south-east",
    areaSlug: "se-cambridge",
    name: "Gog Magog gentle hills",
    distanceKm: 10.5,
    terrain: "Trail",
    vibe: "Just enough hills to feel productive.",
    notes: "Trail conditions vary; best as an easy/steady run."
  },

  // ======================
  // SOUTH WEST — Bristol
  // ======================
  {
    id: "sw-bristol-downs",
    regionSlug: "south-west",
    areaSlug: "sw-bristol",
    name: "Bristol Downs + suspension bridge",
    distanceKm: 9,
    terrain: "Road",
    vibe: "Iconic views with rolling effort.",
    notes: "Mind the climb if you drop to the river."
  },
  {
    id: "sw-bristol-harbour",
    regionSlug: "south-west",
    areaSlug: "sw-bristol",
    name: "Harbourside loop",
    distanceKm: 7.8,
    terrain: "Road",
    vibe: "Flat, easy, and great for steady pacing.",
    notes: "Can get busy; mornings give you the cleanest line."
  },

  // South West — Bath
  {
    id: "sw-bath-canal",
    regionSlug: "south-west",
    areaSlug: "sw-bath",
    name: "Canal path cruise",
    distanceKm: 10,
    terrain: "Trail",
    vibe: "Smooth, flat, and sheltered.",
    notes: "Towpath can be narrow; keep it easy in busy sections."
  },
  {
    id: "sw-bath-hills",
    regionSlug: "south-west",
    areaSlug: "sw-bath",
    name: "Bath skyline hill tester",
    distanceKm: 8.5,
    terrain: "Mixed",
    vibe: "Hills that make easy runs feel suspiciously hard.",
    notes: "Keep effort controlled; great strength-building route."
  },

  // South West — Exeter
  {
    id: "sw-exe-river-exe",
    regionSlug: "south-west",
    areaSlug: "sw-exeter",
    name: "Exeter Quay → Exe trail",
    distanceKm: 10,
    terrain: "Trail",
    vibe: "Flat, scenic, and tempo-friendly.",
    notes: "Good surface most of the year; can be windy in open stretches."
  },
  {
    id: "sw-exe-park-loops",
    regionSlug: "south-west",
    areaSlug: "sw-exeter",
    name: "Park loops + extensions",
    distanceKm: 6,
    terrain: "Road",
    vibe: "Reliable and repeatable.",
    notes: "Loop-based route for sessions; extend as needed."
  },

  // South West — Bournemouth
  {
    id: "sw-bmth-seafront",
    regionSlug: "south-west",
    areaSlug: "sw-bournemouth",
    name: "Seafront long straight",
    distanceKm: 8,
    terrain: "Road",
    vibe: "Perfect rhythm running — unless wind disagrees.",
    notes: "Out-and-back is simplest; great for progression runs."
  },
  {
    id: "sw-bmth-woodland",
    regionSlug: "south-west",
    areaSlug: "sw-bournemouth",
    name: "Woodland shelter loop",
    distanceKm: 9.5,
    terrain: "Trail",
    vibe: "Sheltered and forgiving underfoot.",
    notes: "Ideal when it’s gusty; expect some mud after rain."
  },

  // ======================
  // SCOTLAND — Glasgow
  // ======================
  {
    id: "scot-gla-kelvingrove",
    regionSlug: "scotland-central-belt",
    areaSlug: "scot-glasgow",
    name: "Kelvingrove + riverside",
    distanceKm: 8.5,
    terrain: "Road",
    vibe: "City park energy + flat riverside miles.",
    notes: "Good lighting, good vibes, easy to extend."
  },
  {
    id: "scot-gla-canal",
    regionSlug: "scotland-central-belt",
    areaSlug: "scot-glasgow",
    name: "Canal path steady",
    distanceKm: 12,
    terrain: "Trail",
    vibe: "Flat and steady, perfect for easy miles.",
    notes: "Watch for mud after rain; sheltered when windy."
  },

  // Scotland — Edinburgh
  {
    id: "scot-edi-arthurs-seat",
    regionSlug: "scotland-central-belt",
    areaSlug: "scot-edinburgh",
    name: "Holyrood / Arthur’s Seat loop",
    distanceKm: 8,
    terrain: "Trail",
    vibe: "Hilly, iconic, and extremely honest.",
    notes: "Trail shoes help. Keep effort easy unless you want a workout."
  },
  {
    id: "scot-edi-water-of-leith",
    regionSlug: "scotland-central-belt",
    areaSlug: "scot-edinburgh",
    name: "Water of Leith cruise",
    distanceKm: 10,
    terrain: "Mixed",
    vibe: "Sheltered and steady with nice scenery.",
    notes: "Some narrow sections; mornings are quieter."
  },

  // Scotland — Stirling
  {
    id: "scot-sti-riverside",
    regionSlug: "scotland-central-belt",
    areaSlug: "scot-stirling",
    name: "Riverside easy",
    distanceKm: 7,
    terrain: "Road",
    vibe: "Calm, flat, and very runnable.",
    notes: "Great for easy days; extend with extra out-and-back."
  },
  {
    id: "scot-sti-hill-tester",
    regionSlug: "scotland-central-belt",
    areaSlug: "scot-stirling",
    name: "Castle hill tester",
    distanceKm: 6.5,
    terrain: "Mixed",
    vibe: "Short but punchy — good strength stimulus.",
    notes: "Keep it controlled; this one adds spice quickly."
  },

  // ======================
  // WALES — Cardiff
  // ======================
  {
    id: "wales-cardiff-bay",
    regionSlug: "wales-south",
    areaSlug: "wales-cardiff",
    name: "Cardiff Bay loop-ish",
    distanceKm: 10.5,
    terrain: "Road",
    vibe: "Sea air and long straights, good for rhythm.",
    notes: "Can feel exposed in strong winds; great at sunrise/sunset."
  },
  {
    id: "wales-cardiff-taff-trail",
    regionSlug: "wales-south",
    areaSlug: "wales-cardiff",
    name: "Taff Trail steady",
    distanceKm: 12,
    terrain: "Trail",
    vibe: "Flat and extendable — perfect for longer easy runs.",
    notes: "Surface varies; good option when roads are busy."
  },

  // Wales — Swansea
  {
    id: "wales-swansea-seafront",
    regionSlug: "wales-south",
    areaSlug: "wales-swansea",
    name: "Swansea Bay out-and-back",
    distanceKm: 8,
    terrain: "Road",
    vibe: "Straight, flat, and very paceable.",
    notes: "Wind can turn this into a session; pick direction wisely."
  },
  {
    id: "wales-swansea-park",
    regionSlug: "wales-south",
    areaSlug: "wales-swansea",
    name: "Park loops (session base)",
    distanceKm: 6,
    terrain: "Mixed",
    vibe: "Reliable loop for intervals or tempos.",
    notes: "Loop-based: add blocks without thinking too hard."
  },

  // Wales — Newport
  {
    id: "wales-newport-river",
    regionSlug: "wales-south",
    areaSlug: "wales-newport",
    name: "Riverside steady",
    distanceKm: 9,
    terrain: "Road",
    vibe: "Easy pacing with long straights.",
    notes: "Good for steady runs; extend as needed."
  },
  {
    id: "wales-newport-wetlands",
    regionSlug: "wales-south",
    areaSlug: "wales-newport",
    name: "Wetlands easy trail",
    distanceKm: 7.5,
    terrain: "Trail",
    vibe: "Quiet and sheltered — good for easy days.",
    notes: "Trail shoes after rain; great if you want calm miles."
  }
];