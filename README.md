## Can I go for a run today? (UK)

A public, desktop‑first Next.js app that helps UK runners decide whether it&apos;s a good idea to head out in the next 24 hours. It uses Open‑Meteo for weather, MapLibre for maps, and a small advice engine to turn numbers into practical guidance.

### Tech stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Maps**: MapLibre GL JS with a free demo style
- **Weather**: Open‑Meteo (no API key required)

### Features in Iteration 1

- **Landing page `/`**
  - Full‑width UK map with MapLibre.
  - Region selector (default **London**).
  - Time scrubber for hour offset **0..24**.
  - Region conditions for the selected time (precip probability/amount, temperature, feels‑like, wind, gusts).
  - **Run Readiness panel** with score (0–100), label, reasons, clothing, shoe and hydration advice, plus a light‑hearted vibe line.
  - **Best run window (next 24h)**: picks the best single 2‑hour slot based on score.
- **Regions `/regions`**
  - Cards for each configured region (London, South East, South West, North West, Scotland – Central Belt, Wales – South).
  - Each shows current score, label, a short vibe line, and the best window summary.
  - Click through to `/regions/[slug]` for a focused map + panel view.
- **Routes `/routes`**
  - Static, curated route placeholders per region (no GPX yet).
- **Map**
  - Uses a free MapLibre demo style (no keys, no proprietary tiles).
  - Shows sample points as circle markers, coloured by run score.
  - Click markers for a popup with local conditions.
  - Fits the map to each region’s bounding box.

### Local development

1. **Install dependencies**

```bash
npm install
```

2. **Run the dev server**

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

3. **Type checking and linting**

```bash
npm run lint
```

### Build and run in production mode

```bash
npm run build
npm start
```

### Deploying to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Create a new project in Vercel and import the repo.
3. Vercel will auto‑detect the Next.js app and use:
   - **Build command**: `npm run build`
   - **Output**: `.next`
4. No environment variables or secrets are required for Iteration 1 (Open‑Meteo is keyless; MapLibre uses a public demo style).

### Weather provider and caching

- Server‑side API route: **`/api/weather`** (Next.js App Router).
- Uses **Open‑Meteo** hourly forecast (`temperature_2m`, `apparent_temperature`, `precipitation`, `precipitation_probability`, `windspeed_10m`, `windgusts_10m`) with timezone `Europe/London`.
- Fetches data per sample point with a small concurrency limiter (max 4 in flight).
- Normalises to a region summary plus per‑point snapshots.
- In‑memory cache (simple `Map` with TTL) to avoid hammering the provider.
  - Designed so you can later replace this with Vercel KV or another store in one place (`src/lib/weather.ts`).

### Advice engine

- Pure, deterministic TypeScript module in `src/lib/advice.ts`.
- Turns a region summary into:
  - **score** (0–100) and label (**Great / OK / Caution / Avoid**)
  - reasons[]
  - clothing[]
  - shoes[]
  - fuelHydration[]
  - vibeLine
- Rules take into account:
  - Precipitation amount and probability.
  - Wind speed and particularly gusts.
  - Apparent temperature for both cold and warm/humid conditions.
  - Soft bonuses for &quot;perfect&quot; conditions.

### Map implementation

- Map is encapsulated in `src/components/MapView.tsx` as a client component.
- Uses MapLibre GL with `https://demotiles.maplibre.org/style.json` (free, keyless).
- Adds a GeoJSON source for sample points and a coloured circle layer keyed by run score.
- Clicking a marker opens a popup with the main metrics.
- **Iteration 2 note**: the map component is structured to make it easy to add raster or tile‑based weather overlays on top of the base map (see the comment next to the layer setup).

### UI notes

- Desktop‑first:
  - Top nav with tabs for **Map**, **Regions**, **Routes**.
  - Main layout: map on the left, run panel on the right.
- Mobile:
  - Map on top, panels stacked below (ready for a future bottom‑sheet treatment).
- Styling:
  - Blue + white theme with a pale blue background.
  - Badges/pills for labels and scores.
  - Light humour in the copy without getting in the way of the data.

