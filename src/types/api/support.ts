export type SupportTicketStatus = "open" | "in_progress" | "resolved";

export type SupportTicketCreate = {
    message: string;
    guest_name?: string | null;
    guest_email?: string | null;
    page_path?: string | null;
};

export type SupportTicketOut = {
    id: string;
    message: string;
    status: SupportTicketStatus;
    admin_response: string | null;
    responded_at: string | null;
    created_at: string;
};

export type AdminSupportTicketOut = SupportTicketOut & {
    user_id: string | null;
    submitter_name: string | null;
    submitter_email: string | null;
    submitted_ip: string | null;
    submitted_user_agent: string | null;
    submitted_path: string | null;
};

export type SupportTicketRespond = {
    response: string;
    status: SupportTicketStatus;
};
