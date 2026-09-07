"use client";

import { useState } from "react";
import { Button, Card, Chip, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { respondMyBookingMemberInvite } from "@/lib/ensemble-members";
import type { BookingOut } from "@/types/api";

type Props = {
    booking: BookingOut;
    onUpdated: (booking: BookingOut) => void;
};

const STATUS_META: Record<
    string,
    { label: string; color: "warning" | "success" | "danger" | "default" }
> = {
    pending: { label: "Pendiente de tu respuesta", color: "warning" },
    accepted: { label: "Aceptaste la convocatoria", color: "success" },
    declined: { label: "Rechazaste la convocatoria", color: "danger" },
};

export default function BookingMemberInviteCard({ booking, onUpdated }: Props) {
    const [busy, setBusy] = useState<"accept" | "decline" | null>(null);
    const status = booking.member_invite_status ?? "pending";
    const meta = STATUS_META[status] ?? {
        label: status,
        color: "default" as const,
    };
    const canRespond =
        status === "pending" && booking.status !== "cancelled";

    async function respond(action: "accept" | "decline") {
        setBusy(action);
        try {
            const updated = await respondMyBookingMemberInvite(booking.id, action);
            onUpdated(updated);
            addToast({
                title:
                    action === "accept"
                        ? "Convocatoria aceptada"
                        : "Convocatoria rechazada",
                description:
                    action === "accept"
                        ? "Ya puedes coordinar ubicación, mensajes y compartir con invitados."
                        : "El líder de la agrupación fue notificado.",
                color: action === "accept" ? "success" : "warning",
            });
        } catch (error) {
            addToast({
                title: "No se pudo responder",
                description:
                    error instanceof Error ? error.message : "Intenta de nuevo.",
                color: "danger",
            });
        } finally {
            setBusy(null);
        }
    }

    return (
        <Card className="border border-secondary/30 shadow-soft">
            <div className="p-4 sm:p-5 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <Chip size="sm" color="secondary" variant="flat">
                        Vista de integrante
                    </Chip>
                    <Chip size="sm" color={meta.color} variant="flat">
                        {meta.label}
                    </Chip>
                </div>
                <div>
                    <h2 className="text-lg font-bold">
                        {canRespond
                            ? "Te convocaron a este evento"
                            : "Tu participación"}
                    </h2>
                    <p className="text-sm text-default-600 mt-1">
                        {canRespond
                            ? "Revisa el detalle del compromiso y acepta o rechaza la convocatoria. El líder verá tu respuesta."
                            : status === "accepted"
                              ? "Participas en este evento. Puedes ver ubicación en vivo, reacciones, conversación y compartir con invitados."
                              : status === "declined"
                                ? "Indicaste que no asistirás. El líder puede ver este estado."
                                : "Puedes consultar el detalle del compromiso a la izquierda."}
                    </p>
                </div>
                {canRespond ? (
                    <div className="flex flex-wrap gap-2">
                        <Button
                            color="danger"
                            variant="flat"
                            radius="lg"
                            isLoading={busy === "decline"}
                            isDisabled={busy === "accept"}
                            startContent={
                                <Icon icon="material-symbols:close" width={18} />
                            }
                            onPress={() => respond("decline")}
                        >
                            Rechazar
                        </Button>
                        <Button
                            color="success"
                            radius="lg"
                            className="font-semibold"
                            isLoading={busy === "accept"}
                            isDisabled={busy === "decline"}
                            startContent={
                                <Icon icon="material-symbols:check" width={18} />
                            }
                            onPress={() => respond("accept")}
                        >
                            Aceptar convocatoria
                        </Button>
                    </div>
                ) : null}
            </div>
        </Card>
    );
}
