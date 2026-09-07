import { apiFetch } from "@/lib/api";
import type {
    BookingGuestReviewCreate,
    BookingReviewOut,
    BookingShareOut,
    BookingSharePublicOut,
} from "@/types/api";

export function getBookingShare(bookingId: string) {
    return apiFetch<BookingShareOut>(`/bookings/${bookingId}/share`);
}

export function enableBookingShare(bookingId: string) {
    return apiFetch<BookingShareOut>(`/bookings/${bookingId}/share/enable`, {
        method: "POST",
    });
}

export function disableBookingShare(bookingId: string) {
    return apiFetch<BookingShareOut>(`/bookings/${bookingId}/share/disable`, {
        method: "POST",
    });
}

export function getPublicShare(token: string) {
    return apiFetch<BookingSharePublicOut>(`/public/share/${token}`);
}

export function listPublicShareReviews(token: string) {
    return apiFetch<BookingReviewOut[]>(`/public/share/${token}/reviews`);
}

export function createPublicShareReview(
    token: string,
    payload: BookingGuestReviewCreate,
) {
    return apiFetch<BookingReviewOut>(`/public/share/${token}/reviews`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function uploadPublicShareFile(
    token: string,
    file: File,
): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const base =
        typeof window !== "undefined"
            ? process.env.NEXT_PUBLIC_API_URL || "/api/v1"
            : process.env.API_URL_INTERNAL ||
              process.env.NEXT_PUBLIC_API_URL ||
              "http://localhost:8000/api/v1";

    const res = await fetch(`${base}/public/share/${token}/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });
    if (!res.ok) {
        throw new Error("No se pudo subir el archivo");
    }
    const data = (await res.json()) as { url: string };
    return data.url;
}

export function guestNameStorageKey(token: string) {
    return `chivapp-share-guest:${token}`;
}
