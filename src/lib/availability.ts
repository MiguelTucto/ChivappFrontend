import { apiFetch } from "@/lib/api";
import type { AvailabilityCreate, AvailabilityOut, AvailabilityUpdate } from "@/types/api";

export function getMyAvailability() {
    return apiFetch<AvailabilityOut[]>("/availability/me");
}

export function getMusicianAvailability(musicianId: string) {
    return apiFetch<AvailabilityOut[]>(`/availability/musician/${musicianId}`);
}

export function createAvailability(payload: AvailabilityCreate) {
    return apiFetch<AvailabilityOut>("/availability/me", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function deleteAvailability(id: string) {
    return apiFetch<void>(`/availability/me/${id}`, { method: "DELETE" });
}

export function updateAvailability(id: string, payload: AvailabilityUpdate) {
    return apiFetch<AvailabilityOut>(`/availability/me/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}
