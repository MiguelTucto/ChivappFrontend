import { apiFetch } from "@/lib/api";
import type { MusicianMediaCreate, MusicianMediaOut } from "@/types/api";

export function getMyMedia() {
    return apiFetch<MusicianMediaOut[]>("/musicians/media/me");
}

export function createMedia(payload: MusicianMediaCreate) {
    return apiFetch<MusicianMediaOut>("/musicians/media/me", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function deleteMedia(id: string) {
    return apiFetch<void>(`/musicians/media/me/${id}`, { method: "DELETE" });
}
