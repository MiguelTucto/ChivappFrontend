function getApiUrl(): string {
    if (typeof window !== "undefined") {
        return process.env.NEXT_PUBLIC_API_URL || "/api/v1";
    }
    if (process.env.API_URL_INTERNAL) {
        return process.env.API_URL_INTERNAL.replace(/\/$/, "");
    }
    if (process.env.API_PROXY_TARGET) {
        const base = process.env.API_PROXY_TARGET.replace(/\/$/, "");
        return base.endsWith("/api/v1") ? base : `${base}/api/v1`;
    }
    if (process.env.BACKEND_URL) {
        const base = process.env.BACKEND_URL.replace(/\/$/, "");
        return base.endsWith("/api/v1") ? base : `${base}/api/v1`;
    }
    const publicUrl = process.env.NEXT_PUBLIC_API_URL;
    if (publicUrl && (publicUrl.startsWith("http://") || publicUrl.startsWith("https://"))) {
        return publicUrl.replace(/\/$/, "");
    }
    if (process.env.NODE_ENV === "production") {
        return "https://api.chiv.app/api/v1";
    }
    return "http://localhost:8000/api/v1";
}


export class ApiError extends Error {
    constructor(
        public endpoint: string,
        public status: number,
        message?: string,
    ) {
        super(message ?? `API error: ${endpoint} (${status})`);
        this.name = "ApiError";
    }
}

async function parseErrorMessage(res: Response): Promise<string> {
    try {
        const body = await res.json();
        if (typeof body.detail === "string") return body.detail;
        if (typeof body.error === "string") return body.error;
        if (Array.isArray(body.detail)) {
            return body.detail
                .map((item: {
                    msg?: string;
                    message?: string;
                    loc?: Array<string | number>;
                }) => {
                    const msg = item.msg ?? item.message;
                    if (!msg) return null;
                    const field = item.loc?.filter((part) => part !== "body").join(".");
                    return field ? `${field}: ${msg}` : msg;
                })
                .filter(Boolean)
                .join(", ");
        }
    } catch {
        // ignore parse errors
    }
    return `Error ${res.status}`;
}

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    let res: Response;
    try {
        res = await fetch(`${getApiUrl()}${endpoint}`, {
            ...options,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        });
    } catch {
        throw new ApiError(
            endpoint,
            0,
            "No se pudo conectar con el servidor. Verifica que la aplicación esté en ejecución.",
        );
    }

    if (!res.ok) {
        const message = await parseErrorMessage(res);
        throw new ApiError(endpoint, res.status, message);
    }

    if (res.status === 204) {
        return undefined as T;
    }

    return res.json() as Promise<T>;
}
