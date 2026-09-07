"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/contexts/auth-context";
import { useAuthModal } from "@/contexts/auth-modal-context";
import { useIsClient } from "@/hooks/use-is-client";

const buttonClassName =
    "font-semibold shadow-glow hover:shadow-glow-lg transition-shadow w-full sm:w-auto";

export default function JoinAsMusicianButton() {
    const isClient = useIsClient();
    const { user, isLoading } = useAuth();
    const { openRegister } = useAuthModal();

    // Igual que StartBookingButton/BookActionButton: mientras el cliente no
    // termina de hidratar y resolver la sesión, renderizamos siempre el mismo
    // botón (en isLoading) para que el HTML del servidor y el primer paint
    // del cliente coincidan exactamente.
    if (!isClient || isLoading) {
        return (
            <Button
                color="primary"
                radius="full"
                size="lg"
                isLoading
                className={buttonClassName}
            >
                Publica tu perfil gratis
            </Button>
        );
    }

    if (user) return null;

    return (
        <Button
            color="primary"
            radius="full"
            size="lg"
            className={buttonClassName}
            endContent={
                <Icon icon="material-symbols:arrow-right-alt" width={22} height={22} />
            }
            onPress={() =>
                openRegister({
                    defaultRole: "musician",
                    redirect: "/musician/profile",
                })
            }
        >
            Publica tu perfil gratis
        </Button>
    );
}
