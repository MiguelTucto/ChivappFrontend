import { apiFetch } from "@/lib/api";
import type { NotificationOut } from "@/types/api";

export function listNotifications() {
    return apiFetch<NotificationOut[]>("/notifications/me");
}

export function markNotificationRead(id: string) {
    return apiFetch<NotificationOut>(`/notifications/${id}/read`, { method: "POST" });
}
