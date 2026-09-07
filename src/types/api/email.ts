export type EmailTemplateOut = {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    subject: string;
    html_body: string;
    text_body: string;
    available_variables: string[];
    enabled: boolean;
    created_at: string;
    updated_at: string;
};

export type EmailTemplateUpdate = {
    name?: string;
    description?: string | null;
    subject?: string;
    html_body?: string;
    text_body?: string;
    enabled?: boolean;
};

export type EmailLogOut = {
    id: string;
    template_slug: string;
    recipient: string;
    subject: string;
    status: "sent" | "failed" | "skipped" | string;
    error_message: string | null;
    provider_message_id: string | null;
    user_id: string | null;
    meta: Record<string, unknown> | null;
    created_at: string;
};

export type EmailTemplatePreviewRequest = {
    to?: string;
    context?: Record<string, string>;
};

export type EmailTemplateRenderRequest = {
    context?: Record<string, string>;
    subject?: string;
    html_body?: string;
    text_body?: string;
};

export type EmailTemplateRenderOut = {
    subject: string;
    html: string;
    text: string;
    context: Record<string, string>;
};

export type EmailVerificationResult = {
    message: string;
    email_verified: boolean;
};

export type PasswordResetPreviewOut = {
    email: string;
    fullname: string;
};
