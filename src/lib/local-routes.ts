export type LocalRoute = {
    id: string;
    name: string;
    distanceKm: number;
    // GeoJSON LineString coordinates are [lon, lat]
    coordinates: [number, number][];
  };
  
  export const CHESTER_ROUTES: LocalRoute[] = [
    {
      id: "hoole-faulkner-warmup-3k",
      name: "Hoole Road → The Faulkner (easy 3K loop-ish)",
      distanceKm: 3.0,
      coordinates: [
        [-2.877193, 53.200082], // Hoole Road waypoint
        [-2.875758, 53.198643], // Faulkner St / CH2 3BE centroid
        [-2.8799, 53.1989],     // small bend back west
        [-2.877193, 53.200082], // back
      ],
    },
    {
      id: "hoole-to-canal-5k",
      name: "Hoole → Canal out-and-back (approx 5K)",
      distanceKm: 5.0,
      coordinates: [
        [-2.877193, 53.200082], // Hoole Road
        [-2.875758, 53.198643], // Faulkner area
        [-2.8865, 53.2000],     // head west-ish toward canal
        [-2.901306, 53.200611], // canal towpath waypoint
        [-2.8865, 53.2000],
        [-2.875758, 53.198643],
        [-2.877193, 53.200082],
      ],
    },
    {
      id: "canal-cruise-8k",
      name: "Canal cruise (approx 8K out-and-back)",
      distanceKm: 8.0,
      coordinates: [
        [-2.901306, 53.200611], // canal
        [-2.9075, 53.2020],     // along canal
        [-2.9145, 53.2035],     // further along canal
        [-2.9075, 53.2020],
        [-2.901306, 53.200611],
      ],
    },
  ];