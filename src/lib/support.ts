import { apiFetch } from "@/lib/api";
import type { SupportTicketCreate, SupportTicketOut } from "@/types/api";

export function createSupportTicket(payload: SupportTicketCreate) {
    return apiFetch<SupportTicketOut>("/support/tickets", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function getMySupportTickets() {
    return apiFetch<SupportTicketOut[]>("/support/tickets/me");
}
