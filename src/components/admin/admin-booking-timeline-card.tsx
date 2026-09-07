"use client";

import { Card, CardBody, Chip, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { buildBookingTimeline } from "@/lib/booking-timeline";
import type { BookingStatus } from "@/types/api";

type Props = {
    status: BookingStatus;
    balanceDue?: number | null;
    hasReview?: boolean;
};

const STATE_ICON: Record<string, string> = {
    done: "material-symbols:check-circle",
    current: "material-symbols:radio-button-checked",
    skipped: "material-symbols:skip-next-outline",
    upcoming: "material-symbols:radio-button-unchecked",
};

const STATE_COLOR: Record<string, string> = {
    done: "text-success",
    current: "text-primary",
    skipped: "text-default-400",
    upcoming: "text-default-300",
};

/** Timeline de solo lectura para admin: el rol pasado a buildBookingTimeline solo
 * afecta el copy en 2da persona (actorHint), que no se muestra aquí. */
export default function AdminBookingTimelineCard({ status, balanceDue, hasReview }: Props) {
    const timeline = buildBookingTimeline(status, "contractor", {
        balanceDue,
        hasReview,
    });

    return (
        <Card className="border border-default-200/70 shadow-soft">
            <CardBody className="gap-4 p-6">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold">Avance de la reserva</h3>
                    {timeline.isCancelled ? (
                        <Chip color="danger" variant="flat" size="sm">
                            Cancelada
                        </Chip>
                    ) : (
                        <Chip color="primary" variant="flat" size="sm">
                            {timeline.progressPercent}%
                        </Chip>
                    )}
                </div>

                {timeline.isCancelled ? (
                    <p className="text-sm text-default-500">
                        Esta reserva fue cancelada; no tiene un avance de etapas.
                    </p>
                ) : (
                    <>
                        <Progress
                            value={timeline.progressPercent}
                            color="primary"
                            radius="full"
                            aria-label="Progreso de la reserva"
                        />
                        <ul className="flex flex-col gap-3">
                            {timeline.steps.map((step) => (
                                <li key={step.id} className="flex items-start gap-3">
                                    <Icon
                                        icon={STATE_ICON[step.state]}
                                        width={20}
                                        className={`shrink-0 mt-0.5 ${STATE_COLOR[step.state]}`}
                                    />
                                    <div className="min-w-0">
                                        <p
                                            className={`text-sm font-semibold ${
                                                step.state === "upcoming"
                                                    ? "text-default-400"
                                                    : "text-foreground"
                                            }`}
                                        >
                                            {step.title}
                                        </p>
                                        <p className="text-xs text-default-500 mt-0.5">
                                            {step.description}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </CardBody>
        </Card>
    );
}
