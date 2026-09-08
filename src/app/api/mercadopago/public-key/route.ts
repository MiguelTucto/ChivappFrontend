import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    let publicKey =
        process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY ||
        process.env.NEXT_PUBLIC_MERCADO_PAGO_P ||
        process.env.MERCADO_PAGO_PUBLIC_KEY ||
        "";

    if (!publicKey) {
        for (const [key, value] of Object.entries(process.env)) {
            if (
                typeof value === "string" &&
                (value.startsWith("APP_USR-") || value.startsWith("TEST-")) &&
                (key.toUpperCase().includes("MERCADO") || key.toUpperCase().includes("MP") || key.toUpperCase().includes("PUBLIC"))
            ) {
                publicKey = value;
                break;
            }
        }
    }

    if (!publicKey) {
        try {
            const backendBase =
                process.env.API_PROXY_TARGET ||
                process.env.BACKEND_URL ||
                "https://chivappbackend-688017127648.us-central1.run.app";
            const res = await fetch(
                `${backendBase.replace(/\/$/, "")}/api/v1/payments/mercadopago/public-key`,
                { signal: AbortSignal.timeout(3000) }
            );
            if (res.ok) {
                const data = await res.json();
                if (data?.public_key) {
                    publicKey = data.public_key;
                }
            }
        } catch {
            // ignore network errors
        }
    }

    return NextResponse.json(
        { publicKey },
        {
            headers: {
                "Cache-Control": "no-store, max-age=0",
            },
        },
    );
}
