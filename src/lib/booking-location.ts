import { apiFetch } from "@/lib/api";
import type {
    LiveLocationCoords,
    LiveLocationPingOut,
    LiveLocationSessionOut,
} from "@/types/api";

function getApiUrl(): string {
    if (typeof window !== "undefined") {
        return process.env.NEXT_PUBLIC_API_URL || "/api/v1";
    }
    return (
        process.env.API_URL_INTERNAL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:8000/api/v1"
    );
}

export function getLiveLocation(bookingId: string) {
    return apiFetch<LiveLocationSessionOut>(
        `/bookings/${bookingId}/live-location`,
    );
}

export function shareLiveLocation(bookingId: string, coords: LiveLocationCoords) {
    return apiFetch<LiveLocationSessionOut>(
        `/bookings/${bookingId}/live-location/share`,
        {
            method: "POST",
            body: JSON.stringify(coords),
        },
    );
}

export function updateLiveLocation(bookingId: string, coords: LiveLocationCoords) {
    return apiFetch<LiveLocationSessionOut>(
        `/bookings/${bookingId}/live-location/update`,
        {
            method: "POST",
            body: JSON.stringify(coords),
        },
    );
}

export function refreshLiveLocation(bookingId: string, coords: LiveLocationCoords) {
    return apiFetch<LiveLocationSessionOut>(
        `/bookings/${bookingId}/live-location/refresh`,
        {
            method: "POST",
            body: JSON.stringify(coords),
        },
    );
}

export function requestLiveLocation(bookingId: string) {
    return apiFetch<LiveLocationSessionOut>(
        `/bookings/${bookingId}/live-location/request`,
        { method: "POST" },
    );
}

export function stopLiveLocation(bookingId: string) {
    return apiFetch<LiveLocationSessionOut>(
        `/bookings/${bookingId}/live-location/stop`,
        { method: "POST" },
    );
}

/** Best-effort stop when the tab/app closes (no await). */
export function stopLiveLocationBeacon(bookingId: string): void {
    if (typeof window === "undefined") return;
    try {
        void fetch(`${getApiUrl()}/bookings/${bookingId}/live-location/stop`, {
            method: "POST",
            credentials: "include",
            keepalive: true,
            headers: { "Content-Type": "application/json" },
            body: "{}",
        });
    } catch {
        // ignore unload failures
    }
}

export function getLiveLocationHistory(bookingId: string) {
    return apiFetch<LiveLocationPingOut[]>(
        `/bookings/${bookingId}/live-location/history`,
    );
}

export function readDevicePosition(
    options?: PositionOptions,
): Promise<LiveLocationCoords> {
    return new Promise((resolve, reject) => {
        if (typeof navigator === "undefined" || !navigator.geolocation) {
            reject(new Error("Tu dispositivo no soporta geolocalización."));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                });
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    reject(
                        new Error(
                            "Permiso de ubicación denegado. Actívalo en el navegador.",
                        ),
                    );
                    return;
                }
                reject(new Error("No se pudo obtener tu ubicación. Intenta de nuevo."));
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 5000,
                ...options,
            },
        );
    });
}

export function watchDevicePosition(
    onPosition: (coords: LiveLocationCoords) => void,
    onError?: (error: Error) => void,
): () => void {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
        onError?.(new Error("Tu dispositivo no soporta geolocalización."));
        return () => undefined;
    }
    const watchId = navigator.geolocation.watchPosition(
        (position) => {
            onPosition({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
            });
        },
        (error) => {
            if (error.code === error.PERMISSION_DENIED) {
                onError?.(
                    new Error(
                        "Permiso de ubicación denegado. Actívalo en el navegador.",
                    ),
                );
                return;
            }
            onError?.(
                new Error("No se pudo obtener tu ubicación. Intenta de nuevo."),
            );
        },
        {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 5000,
        },
    );
    return () => navigator.geolocation.clearWatch(watchId);
}
