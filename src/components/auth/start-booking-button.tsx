"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/contexts/auth-context";
import { useAuthModal } from "@/contexts/auth-modal-context";
import { useContractorVerification } from "@/hooks/use-contractor-verification";
import { useIsClient } from "@/hooks/use-is-client";

export default function StartBookingButton() {
    const isClient = useIsClient();
    const { user, isLoading } = useAuth();
    const { openLogin } = useAuthModal();
    const { isVerified, isLoading: isCheckingVerification } = useContractorVerification(
        !!user && user.role === "contractor",
        user?.is_verified ?? false,
    );

    // Keep SSR and first client paint identical to avoid hydration mismatches
    // when auth resolves in the parent before this subtree hydrates.
    if (
        !isClient ||
        isLoading ||
        (user?.role === "contractor" && isCheckingVerification)
    ) {
        return (
            <Button
                variant="flat"
                radius="full"
                isLoading
                className="w-full sm:w-auto max-w-sm bg-content1 text-foreground font-semibold"
            >
                Comenzar reserva
            </Button>
        );
    }

    if (!user) {
        return (
            <Button
                variant="flat"
                radius="full"
                className="w-full sm:w-auto max-w-sm bg-content1 text-foreground font-semibold hover:bg-primary sm:hover:scale-105 transition-all duration-300"
                onPress={() => openLogin({ redirect: "/musicians" })}
                endContent={
                    <Icon icon="material-symbols:arrow-right" width={22} height={22} />
                }
            >
                <span className="sm:hidden">Inicia sesión</span>
                <span className="hidden sm:inline">Inicia sesión para reservar</span>
            </Button>
        );
    }

    if (user.role !== "contractor") {
        return (
            <div className="flex flex-col items-center gap-3 w-full max-w-sm">
                <Button
                    isDisabled
                    variant="flat"
                    radius="full"
                    className="w-full bg-content1 text-foreground font-semibold"
                >
                    Comenzar reserva
                </Button>
                <p className="text-sm text-default-600 text-pretty px-1">
                    Solo los contratistas pueden enviar solicitudes. Puedes seguir
                    explorando perfiles libremente.
                </p>
            </div>
        );
    }

    if (!isVerified) {
        return (
            <Button
                as={Link}
                href="/contractor/profile"
                variant="flat"
                radius="full"
                className="w-full sm:w-auto max-w-sm bg-warning/20 text-foreground font-semibold"
            >
                <span className="sm:hidden">Verifica tu perfil</span>
                <span className="hidden sm:inline">Verifica tu perfil para reservar</span>
            </Button>
        );
    }

    return (
        <Button
            as={Link}
            href="/musicians"
            variant="flat"
            radius="full"
            className="w-full sm:w-auto max-w-sm bg-content1 text-foreground font-semibold hover:bg-primary sm:hover:scale-105 transition-all duration-300"
            endContent={
                <Icon icon="material-symbols:arrow-right" width={22} height={22} />
            }
        >
            Explorar músicos
        </Button>
    );
}
