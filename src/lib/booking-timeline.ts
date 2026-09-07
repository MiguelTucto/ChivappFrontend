import type { BookingStatus, UserRole } from "@/types/api";

export type TimelineStepId =
    | "request"
    | "quote"
    | "contract"
    | "advance"
    | "confirmed"
    | "balance"
    | "event"
    | "done";

export type TimelineStepState = "done" | "current" | "upcoming" | "skipped";

export type BookingTimelineStep = {
    id: TimelineStepId;
    title: string;
    description: string;
    actorHint: string;
    state: TimelineStepState;
};

const MAIN_FLOW: TimelineStepId[] = [
    "request",
    "quote",
    "contract",
    "advance",
    "confirmed",
    "balance",
    "event",
    "done",
];

const STEP_COPY: Record<
    TimelineStepId,
    { title: string; description: string; musician: string; contractor: string }
> = {
    request: {
        title: "Solicitud",
        description: "El contratista pidió la presentación.",
        musician: "Revisa la solicitud y cotiza.",
        contractor: "Espera la cotización del músico.",
    },
    quote: {
        title: "Cotización",
        description: "Precio y condiciones propuestas por el músico.",
        musician: "Ajusta o confirma tu cotización.",
        contractor: "Acepta o rechaza la cotización.",
    },
    contract: {
        title: "Contrato",
        description: "Revisión, repertorio, firma y aceptación de términos.",
        musician: "Espera la firma del contratista.",
        contractor: "Elige repertorio, firma el contrato y confirma el pago.",
    },
    advance: {
        title: "Anticipo",
        description: "Pago seguro del anticipo con Mercado Pago.",
        musician: "Anticipo acreditado en la plataforma.",
        contractor: "Paga el anticipo con Mercado Pago.",
    },
    confirmed: {
        title: "Reserva confirmada",
        description: "Anticipo confirmado. Coordinación previa al evento.",
        musician: "Coordina detalles y responde cambios.",
        contractor: "Chatea, edita ubicación si hace falta.",
    },
    balance: {
        title: "Saldo final",
        description: "Pago del saldo restante antes del show.",
        musician: "Abono final procesado.",
        contractor: "Paga el saldo restante con Mercado Pago.",
    },
    event: {
        title: "Evento y reseña",
        description: "Show en curso: fotos, comentarios y calificación.",
        musician: "Revisa la experiencia compartida.",
        contractor: "Adjunta fotos y deja tu reseña.",
    },
    done: {
        title: "Finalizada",
        description: "Contratación cerrada y pagos liberados.",
        musician: "Reserva completada.",
        contractor: "Reserva completada.",
    },
};

function statusToStepIndex(status: BookingStatus): number {
    switch (status) {
        case "requested":
            return 0;
        case "accepted":
            return 1;
        case "contract_pending":
        case "contract_signed":
            return 2;
        case "payment_pending":
            return 3;
        case "payment_retained":
        case "change_pending":
            return 4;
        case "balance_pending":
        case "balance_review":
            return 5;
        case "in_progress":
        case "payment_released":
            return 6;
        case "completed":
            return 7;
        case "cancelled":
            return -1;
        default:
            return 0;
    }
}

export function buildBookingTimeline(
    status: BookingStatus,
    role: Extract<UserRole, "musician" | "contractor">,
    options?: { balanceDue?: number | null; hasReview?: boolean },
): {
    steps: BookingTimelineStep[];
    currentIndex: number;
    progressPercent: number;
    nextAction: string;
    destination: string;
    isCancelled: boolean;
} {
    if (status === "cancelled") {
        return {
            steps: [],
            currentIndex: -1,
            progressPercent: 0,
            nextAction: "Esta reserva fue cancelada.",
            destination: "No aplica",
            isCancelled: true,
        };
    }

    const hasReview = Boolean(options?.hasReview);
    let currentIndex = statusToStepIndex(status);

    // Con reseña publicada, el paso "evento" queda validado y el foco pasa a finalizar.
    if (
        hasReview &&
        (status === "in_progress" || status === "payment_released")
    ) {
        currentIndex = 7; // "done" como paso actual pendiente de confirmar
    }

    const skipBalance =
        options?.balanceDue != null &&
        options.balanceDue <= 0 &&
        currentIndex >= 4;

    const steps: BookingTimelineStep[] = MAIN_FLOW.map((id, index) => {
        const copy = STEP_COPY[id];
        let state: TimelineStepState = "upcoming";

        if (id === "balance" && skipBalance && currentIndex > 5) {
            state = "skipped";
        } else if (id === "balance" && skipBalance && currentIndex === 4) {
            state = "upcoming";
        } else if (index < currentIndex) {
            state = "done";
        } else if (index === currentIndex) {
            // Completada: el paso final es "hecho" (verde), no "actual".
            state = status === "completed" ? "done" : "current";
        }

        if (id === "balance" && skipBalance && currentIndex >= 6) {
            state = "done";
        }
        if (id === "balance" && skipBalance && currentIndex === 4) {
            state = "done";
        }

        // Si ya hay reseña y aún no está completed, evento = hecho y final = actual
        if (
            hasReview &&
            (status === "in_progress" || status === "payment_released")
        ) {
            if (id === "event") state = "done";
            if (id === "done") state = "current";
        }

        // Reserva finalizada (cliente o músico): todo el camino en verde.
        if (status === "completed" && state !== "skipped") {
            state = "done";
        }

        return {
            id,
            title: copy.title,
            description: copy.description,
            actorHint: role === "musician" ? copy.musician : copy.contractor,
            state,
        };
    });

    if (status === "change_pending" && steps[4]) {
        steps[4].actorHint =
            role === "musician"
                ? "Hay un cambio pendiente: acéptalo o re-cotiza."
                : "Espera la respuesta del músico a tu cambio.";
        steps[4].description = "Cambio de ubicación/detalles en revisión.";
    }
    if (status === "balance_review" && steps[5]) {
        steps[5].actorHint =
            role === "musician"
                ? "Procesando el pago del saldo con Mercado Pago."
                : "Tu pago del saldo está en procesamiento con Mercado Pago.";
    }
    if (status === "payment_pending" && steps[3]) {
        steps[3].actorHint =
            role === "musician"
                ? "Procesando el pago del anticipo con Mercado Pago."
                : "Tu pago del anticipo está en procesamiento con Mercado Pago.";
    }
    if (
        (status === "in_progress" || status === "payment_released") &&
        !hasReview &&
        steps[6]
    ) {
        steps[6].actorHint =
            role === "musician"
                ? "Espera que el contratista finalice (incluirá su reseña)."
                : "Puedes finalizar: te pediremos la reseña final del show.";
    }
    if (
        (status === "in_progress" || status === "payment_released") &&
        steps[7]
    ) {
        if (hasReview) {
            steps[7].actorHint =
                role === "musician"
                    ? "La reseña final ya está. Puedes finalizar la contratación."
                    : "Reseña final lista. Confirma para finalizar la contratación.";
            steps[7].description =
                "Todo listo: confirma el cierre para liberar pagos.";
        } else if (role === "contractor") {
            steps[7].actorHint =
                "Al finalizar te pediremos estrellas y un comentario del show.";
            steps[7].description =
                "Cierra la contratación; la reseña final se captura en ese paso.";
        }
    }

    if (status === "completed" && steps[7]) {
        steps[7].description = "Contratación cerrada. Esta reserva quedó finalizada.";
        steps[7].actorHint =
            role === "musician"
                ? "Cierre confirmado. Ya no hay acciones pendientes."
                : "Cierre confirmado. Gracias por tu reseña y por usar la plataforma.";
    }

    const current = steps.find((step) => step.state === "current");
    const progressDone = steps.filter(
        (step) => step.state === "done" || step.state === "skipped",
    ).length;
    const progressPercent = Math.round((progressDone / steps.length) * 100);

    return {
        steps,
        currentIndex: status === "completed" ? steps.length - 1 : currentIndex,
        progressPercent: status === "completed" ? 100 : Math.min(progressPercent, 95),
        nextAction:
            status === "completed"
                ? "Esta contratación quedó cerrada."
                : (current?.actorHint ?? "Revisa el detalle de la reserva."),
        destination: STEP_COPY.done.title,
        isCancelled: false,
    };
}

export type CompletionGate = {
    id: string;
    title: string;
    done: boolean;
    hint: string;
};

/** Checklist de lo que falta para poder finalizar la contratación. */
export function getCompletionGates(
    status: BookingStatus,
    options?: {
        balanceDue?: number | null;
        hasReview?: boolean;
        role?: "musician" | "contractor";
    },
): {
    canFinalize: boolean;
    gates: CompletionGate[];
    missing: CompletionGate[];
} {
    const balanceDue = options?.balanceDue ?? null;
    const hasReview = Boolean(options?.hasReview);
    const role = options?.role;
    const statusIndex = statusToStepIndex(status);

    const confirmedDone = statusIndex >= 4 && status !== "cancelled";
    const balanceDone =
        statusIndex >= 6 ||
        (balanceDue != null && balanceDue <= 0 && statusIndex >= 4) ||
        status === "in_progress" ||
        status === "payment_released" ||
        status === "completed";
    const eventPhaseDone =
        status === "in_progress" ||
        status === "payment_released" ||
        status === "completed";
    const reviewDone = hasReview || status === "completed";
    const finalized = status === "completed";

    const gates: CompletionGate[] = [
        {
            id: "confirmed",
            title: "Reserva confirmada",
            done: confirmedDone,
            hint: "El anticipo debe estar validado.",
        },
        {
            id: "balance",
            title: "Abono final cubierto",
            done: balanceDone,
            hint: "Debe pagarse y validarse el saldo (o no haber saldo pendiente).",
        },
        {
            id: "event",
            title: "Fase de evento activa",
            done: eventPhaseDone,
            hint: "El músico debe habilitar la fase de evento.",
        },
        {
            id: "review",
            title: "Reseña final del contratista",
            done: reviewDone,
            hint:
                role === "contractor"
                    ? "Se te pedirá en un popup al pulsar Finalizar."
                    : "El contratista deja estrellas y comentario al finalizar.",
        },
        {
            id: "done",
            title: "Contratación finalizada",
            done: finalized,
            hint: "Pulsa finalizar cuando los pasos anteriores estén listos.",
        },
    ];

    const missing = gates.filter((gate) => !gate.done && gate.id !== "done");
    // El contratista completa la reseña en el popup de Finalizar; no bloquea el botón.
    const blockingMissing = missing.filter(
        (gate) => !(role === "contractor" && gate.id === "review"),
    );
    const canFinalize =
        status !== "completed" &&
        status !== "cancelled" &&
        blockingMissing.length === 0;

    return { canFinalize, gates, missing: blockingMissing };
}
