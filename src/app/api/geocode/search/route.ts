import { NextRequest, NextResponse } from "next/server";
import { searchPlaces } from "@/lib/server/geocoding";

export async function GET(request: NextRequest) {
    const q = request.nextUrl.searchParams.get("q")?.trim();
    if (!q || q.length < 3) {
        return NextResponse.json([]);
    }

    try {
        const results = await searchPlaces(q);
        return NextResponse.json(results);
    } catch {
        return NextResponse.json([], { status: 502 });
    }
}
