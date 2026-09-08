import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Chivapp — Encuentra y contrata músicos para tu evento";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "72px",
                    background:
                        "linear-gradient(135deg, #0F1213 0%, #1a2e33 45%, #234850 100%)",
                    color: "#F5F7F8",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 16,
                            background:
                                "linear-gradient(135deg, #46C0D9 0%, #3A6169 100%)",
                        }}
                    />
                    <div
                        style={{
                            fontSize: 42,
                            fontWeight: 800,
                            letterSpacing: "-0.04em",
                            background:
                                "linear-gradient(90deg, #46C0D9 0%, #7dd8e8 100%)",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        Chivapp
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div
                        style={{
                            fontSize: 64,
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                            lineHeight: 1.1,
                            maxWidth: 900,
                        }}
                    >
                        Encuentra y contrata músicos para tu evento
                    </div>
                    <div
                        style={{
                            fontSize: 28,
                            color: "#A1A1AA",
                            maxWidth: 820,
                            lineHeight: 1.35,
                        }}
                    >
                        Perfiles verificados · Reserva fácil · Eventos inolvidables
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        fontSize: 22,
                        color: "#71717A",
                    }}
                >
                    Músicos verificados para tu evento
                </div>
            </div>
        ),
        { ...size },
    );
}
