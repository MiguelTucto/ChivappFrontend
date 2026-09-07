import { NextRequest, NextResponse } from "next/server";
import { reverseGeocode } from "@/lib/server/geocoding";

export async function GET(request: NextRequest) {
    const lat = Number(request.nextUrl.searchParams.get("lat"));
    const lng = Number(request.nextUrl.searchParams.get("lng"));

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return NextResponse.json({ error: "Coordenadas inválidas" }, { status: 400 });
    }

    try {
        const location = await reverseGeocode(lat, lng);
        if (!location) {
            return NextResponse.json({ error: "No se encontró la dirección" }, { status: 404 });
        }
        return NextResponse.json(location);
    } catch {
        return NextResponse.json({ error: "Error de geocodificación" }, { status: 502 });
    }
}
