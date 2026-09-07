"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/contexts/auth-context";
import { useAuthModal } from "@/contexts/auth-modal-context";
import { useContractorVerification } from "@/hooks/use-contractor-verification";
import { useIsClient } from "@/hooks/use-is-client";

type Props = {
    musicianId: string;
    label?: string;
    size?: "sm" | "md" | "lg";
    radius?: "lg" | "full";
    className?: string;
    fullWidth?: boolean;
    showHelper?: boolean;
    onBook?: () => void;
};

export default function BookActionButton({
    musicianId,
    label = "Contratar",
    size = "lg",
    radius = "lg",
    className = "font-semibold",
    fullWidth = false,
    showHelper = false,
    onBook,
}: Props) {
    const isClient = useIsClient();
    const { user, isLoading } = useAuth();
    const { openLogin } = useAuthModal();
    const pathname = usePathname();
    const { isVerified, isLoading: isCheckingVerification } = useContractorVerification(
        !!user && user.role === "contractor",
        user?.is_verified ?? false,
    );

    // Usa la ruta actual (slug o UUID, la que sea que esté en la barra de
    // direcciones) en vez de reconstruirla desde el id, para no "saltar" a
    // la URL con UUID después de loguearse.
    const bookRedirect = `${pathname || `/musicians/${musicianId}`}?reservar=1`;
    const widthClass = fullWidth ? "w-full" : "w-full sm:w-auto";

    // Keep SSR and first client paint identical to avoid hydration mismatches.
    if (
        !isClient ||
        isLoading ||
        (user?.role === "contractor" && isCheckingVerification)
    ) {
        return (
            <Button
                color="primary"
                radius={radius}
                size={size}
                isLoading
                className={`${className} ${widthClass}`}
            >
                {label}
            </Button>
        );
    }

    if (!user) {
        return (
            <div className={fullWidth ? "w-full" : undefined}>
                <Button
                    color="primary"
                    radius={radius}
                    size={size}
                    className={`${className} ${widthClass}`}
                    onPress={() => openLogin({ redirect: bookRedirect })}
                    endContent={
                        <Icon icon="material-symbols:login" width={20} height={20} />
                    }
                >
                    Inicia sesión para contratar
                </Button>
                {showHelper && (
                    <p className="text-sm text-default-500 mt-3">
                        Puedes explorar perfiles sin cuenta. Para enviar una solicitud de
                        reserva necesitas iniciar sesión como contratista.
                    </p>
                )}
            </div>
        );
    }

    if (user.role !== "contractor") {
        return (
            <div className={fullWidth ? "w-full" : undefined}>
                <Button
                    isDisabled
                    color="primary"
                    radius={radius}
                    size={size}
                    className={`${className} ${widthClass}`}
                >
                    {label}
                </Button>
                {showHelper && (
                    <p className="text-sm text-default-500 mt-3">
                        Solo los contratistas pueden enviar solicitudes de reserva. Como
                        músico puedes explorar perfiles y gestionar tus propias reservas.
                    </p>
                )}
            </div>
        );
    }

    if (!isVerified) {
        return (
            <div className={fullWidth ? "w-full" : undefined}>
                <Button
                    as={Link}
                    href="/contractor/profile"
                    color="warning"
                    radius={radius}
                    size={size}
                    className={`${className} ${widthClass}`}
                >
                    Verifica tu perfil para reservar
                </Button>
                {showHelper && (
                    <p className="text-sm text-default-500 mt-3">
                        Debes completar tu verificación de contratista antes de enviar
                        solicitudes de reserva.
                    </p>
                )}
            </div>
        );
    }

    return (
        <Button
            color="primary"
            radius={radius}
            size={size}
            className={`${className} ${widthClass}`}
            onPress={onBook}
            endContent={
                <Icon icon="material-symbols:calendar-month" width={22} height={22} />
            }
        >
            {label}
        </Button>
    );
}
