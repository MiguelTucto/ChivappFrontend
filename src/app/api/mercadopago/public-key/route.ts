import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const publicKey =
        process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY ||
        process.env.MERCADO_PAGO_PUBLIC_KEY ||
        "";

    return NextResponse.json(
        { publicKey },
        {
            headers: {
                "Cache-Control": "no-store, max-age=0",
            },
        },
    );
}
