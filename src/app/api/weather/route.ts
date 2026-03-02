import { NextResponse } from "next/server";
import { getRegionWeather } from "@/lib/weather";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const regionSlug: string = typeof body.regionSlug === "string" ? body.regionSlug : "london";
    const hourOffsetRaw = Number.isFinite(body.hourOffset) ? body.hourOffset : 0;
    const hourOffset = Math.min(Math.max(Math.round(hourOffsetRaw || 0), 0), 24);

    const data = await getRegionWeather({ regionSlug, hourOffset });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Unable to fetch weather right now. The clouds might be hogging the wifi.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

