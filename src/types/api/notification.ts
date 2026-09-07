export type NotificationCreate = {
    user_id: string;
    type: string;
    title: string;
    message: string;
    meta?: Record<string, unknown> | null;
};

export type NotificationOut = {
    id: string;
    user_id: string;
    type: string;
    title: string;
    message: string;
    meta: Record<string, unknown> | null;
    is_read: boolean;
    created_at: string;
};
