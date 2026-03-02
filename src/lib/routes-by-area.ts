export type Route = {
    id: string;
    name: string;
    areaSlug: string;
    distanceKm: number;
    tags: string[];
    start: { lat: number; lon: number; name: string };
    // optional later: polyline, waypoints, elevation, surface, lighting, etc.
  };
  
  export const ROUTES: Route[] = [
    {
      id: "ldn-hyde-loop",
      name: "Hyde Park + Kensington Gardens loop",
      areaSlug: "london-west",
      distanceKm: 6.2,
      tags: ["flat", "lit", "water", "popular"],
      start: { lat: 51.5073, lon: -0.1657, name: "Hyde Park Corner" }
    },
    {
      id: "ldn-regents-canal",
      name: "Regent’s Canal: Angel → Victoria Park",
      areaSlug: "london-east",
      distanceKm: 8.0,
      tags: ["flat", "canal", "easy"],
      start: { lat: 51.5323, lon: -0.1058, name: "Angel" }
    }
  ];