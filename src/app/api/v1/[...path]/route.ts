import { NextRequest, NextResponse } from "next/server";

function getUpstreamBase(request?: NextRequest): string {
    if (process.env.API_PROXY_TARGET) {
        return process.env.API_PROXY_TARGET.replace(/\/$/, "");
    }
    if (process.env.BACKEND_URL) {
        return process.env.BACKEND_URL.replace(/\/$/, "");
    }
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
    }
    const host = (
        request?.headers.get("x-forwarded-host") ||
        request?.headers.get("host") ||
        ""
    ).toLowerCase();
    if (
        host.includes("chiv.app") ||
        host.includes("run.app") ||
        process.env.NODE_ENV === "production"
    ) {
        return "https://api.chiv.app";
    }
    return "http://localhost:8000";
}

async function fetchUpstream(
    targetUrl: string,
    init: RequestInit,
): Promise<Response> {
    // Never auto-follow redirects: OAuth start/callback must reach the browser.
    return fetch(targetUrl, { ...init, redirect: "manual" });
}

function resolveRedirectUrl(currentUrl: string, location: string): string | null {
    try {
        return new URL(location, currentUrl).toString();
    } catch {
        return null;
    }
}

/** Next strips trailing slashes; FastAPI often requires them — resolve that here. */
function isInternalSlashRedirect(fromUrl: string, toUrl: string, apiBase: string): boolean {
    if (!toUrl.startsWith(apiBase)) return false;
    const from = fromUrl.replace(/\/+$/, "");
    const to = toUrl.replace(/\/+$/, "");
    return from === to;
}

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
    const apiBase = getUpstreamBase(request);
    const hasTrailingSlash = request.nextUrl.pathname.endsWith("/");
    const path = pathSegments.join("/") + (hasTrailingSlash ? "/" : "");
    const search = request.nextUrl.search;
    let targetUrl = `${apiBase}/api/v1/${path}${search}`;

    const headers = new Headers();
    const contentType = request.headers.get("content-type");
    if (contentType) {
        headers.set("content-type", contentType);
    }

    const cookie = request.headers.get("cookie");
    if (cookie) {
        headers.set("cookie", cookie);
    }

    const auth = request.headers.get("authorization");
    if (auth) {
        headers.set("authorization", auth);
    }

    // Metadata reenviada para endpoints que la registran (ej. ayuda/soporte).
    const userAgent = request.headers.get("user-agent");
    if (userAgent) {
        headers.set("user-agent", userAgent);
    }
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        headers.set("x-forwarded-for", forwardedFor);
    }

    const hasBody = !["GET", "HEAD"].includes(request.method);
    const body = hasBody ? await request.arrayBuffer() : undefined;

    let upstream: Response;
    try {
        upstream = await fetchUpstream(targetUrl, {
            method: request.method,
            headers,
            body,
        });

        // Follow only same-path trailing-slash redirects from FastAPI.
        for (let hop = 0; hop < 2; hop++) {
            if (![301, 302, 307, 308].includes(upstream.status)) break;
            const location = upstream.headers.get("location");
            if (!location) break;
            const nextUrl = resolveRedirectUrl(targetUrl, location);
            if (!nextUrl || !isInternalSlashRedirect(targetUrl, nextUrl, apiBase)) break;

            targetUrl = nextUrl;
            upstream = await fetchUpstream(targetUrl, {
                method: request.method,
                headers,
                body,
            });
        }
    } catch {
        return NextResponse.json(
            {
                detail:
                    "No se pudo conectar con el backend. Verifica que el servidor API esté en ejecución.",
            },
            { status: 503 },
        );
    }

    const responseHeaders = new Headers();
    upstream.headers.forEach((value, key) => {
        const lower = key.toLowerCase();
        if (lower === "transfer-encoding") return;
        // Keep any remaining API redirects on the same origin as the Next proxy.
        if (lower === "location" && value.startsWith(apiBase)) {
            responseHeaders.set(key, value.slice(apiBase.length) || "/");
            return;
        }
        responseHeaders.append(key, value);
    });

    return new NextResponse(upstream.body, {
        status: upstream.status,
        headers: responseHeaders,
    });
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
    const { path } = await context.params;
    return proxyRequest(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
    const { path } = await context.params;
    return proxyRequest(request, path);
}

export async function PUT(request: NextRequest, context: RouteContext) {
    const { path } = await context.params;
    return proxyRequest(request, path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    const { path } = await context.params;
    return proxyRequest(request, path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
    const { path } = await context.params;
    return proxyRequest(request, path);
}
