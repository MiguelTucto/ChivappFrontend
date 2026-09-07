"use client";

import { useState } from "react";
import { Button, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/contexts/auth-context";
import { useIsClient } from "@/hooks/use-is-client";
import { ApiError } from "@/lib/api";
import { resendVerificationEmail } from "@/lib/auth";

export default function EmailVerificationBanner({ className = "" }: { className?: string }) {
    const isClient = useIsClient();
    const { user } = useAuth();
    const [sending, setSending] = useState(false);

    // SSR + hydration: stay empty until the client owns auth state.
    if (!isClient || !user || user.role === "admin" || user.is_email_verified) {
        return null;
    }

    async function handleResend() {
        setSending(true);
        try {
            const result = await resendVerificationEmail();
            addToast({ title: result.message, color: "success" });
        } catch (error) {
            addToast({
                title: "No se pudo reenviar",
                description:
                    error instanceof ApiError ? error.message : "Intenta de nuevo.",
                color: "danger",
            });
        } finally {
            setSending(false);
        }
    }

    return (
        <aside
            aria-label="Aviso de verificación de correo"
            className={`w-full ${className}`}
        >
            <div className="rounded-2xl border border-warning/40 bg-warning/10 backdrop-blur-md px-4 py-3 shadow-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-foreground">
                <div className="flex items-center gap-2.5 text-sm">
                    <Icon
                        icon="material-symbols:mark-email-unread"
                        className="text-xl text-warning shrink-0"
                    />
                    <p className="leading-snug">
                        Confirma tu correo <strong>{user.email}</strong> para usar todas las
                        funciones de ChivApp.
                    </p>
                </div>
                <Button
                    size="sm"
                    color="warning"
                    variant="flat"
                    radius="full"
                    isLoading={sending}
                    onPress={handleResend}
                    className="shrink-0 font-medium"
                >
                    Reenviar enlace
                </Button>
            </div>
        </aside>
    );
}
