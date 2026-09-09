"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Button, Card, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import {
    BOOKING_STATUS_COLORS,
    BOOKING_STATUS_LABELS,
    BOOKING_STATUS_TONE_ACCENT_BAR,
    BOOKING_STATUS_TONE_CARD,
    BOOKING_STATUS_TONE_ICON,
    formatBookingDate,
    formatBookingTime,
    formatCurrency,
    getBookingStatusChipVariant,
    getBookingStatusTone,
} from "@/lib/booking-labels";
import {
    contractorPayableTotal,
    platformFeeAmount,
    platformAppFeeAmount,
    platformGatewayFeeAmount,
} from "@/lib/platform-fee";
import {
    buildGoogleMapsUrl,
    buildOpenStreetMapUrl,
    parseLocationReference,
} from "@/lib/geocoding";
import type { BookingOut, UserRole } from "@/types/api";

type Role = Extract<UserRole, "musician" | "contractor">;

type Props = {
    booking: BookingOut;
    confirmed: boolean;
    canEdit: boolean;
    hasPendingChanges: boolean;
    role: Role;
    onEdit: () => void;
    onReviewPending: () => void;
    /** sidebar = denser layout for the sticky side column */
    layout?: "page" | "sidebar";
};

function Section({
    title,
    icon,
    children,
    className = "",
}: {
    title: string;
    icon: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section className={`min-w-0 ${className}`}>
            <div className="flex items-center gap-2 mb-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-default-100 text-default-600">
                    <Icon icon={icon} width={16} />
                </span>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-default-500">
                    {title}
                </h2>
            </div>
            {children}
        </section>
    );
}

function MoneyRow({
    label,
    hint,
    value,
    tone = "default",
}: {
    label: string;
    hint?: string;
    value: string;
    tone?: "default" | "muted" | "emphasis" | "success";
}) {
    const valueClass =
        tone === "emphasis"
            ? "text-primary text-base font-bold"
            : tone === "success"
              ? "text-success font-semibold"
              : tone === "muted"
                ? "text-default-600 font-medium"
                : "text-foreground font-semibold";

    return (
        <div className="flex items-baseline justify-between gap-3">
            <div className="min-w-0">
                <p
                    className={`text-sm leading-snug ${
                        tone === "emphasis"
                            ? "font-semibold text-foreground"
                            : "text-default-600"
                    }`}
                >
                    {label}
                </p>
                {hint ? (
                    <p className="text-[11px] text-default-400 mt-0.5 leading-snug">
                        {hint}
                    </p>
                ) : null}
            </div>
            <p className={`shrink-0 tabular-nums text-sm ${valueClass}`}>{value}</p>
        </div>
    );
}

export default function BookingCommitmentCard({
    booking,
    confirmed,
    canEdit,
    hasPendingChanges,
    role,
    onEdit,
    onReviewPending,
    layout = "page",
}: Props) {
    const isSidebar = layout === "sidebar";
    const tone = getBookingStatusTone(booking.status);
    const iconTone = BOOKING_STATUS_TONE_ICON[tone];
    const servicePrice =
        booking.price_agreed != null ? Number(booking.price_agreed) : null;
    const fee = platformFeeAmount(booking);
    const appFee = platformAppFeeAmount(booking);
    const gatewayFee = platformGatewayFeeAmount(booking);
    const feePercent =
        booking.platform_fee_percent != null
            ? Number(booking.platform_fee_percent)
            : null;
    const contractorTotal = contractorPayableTotal(booking);

    const coords = parseLocationReference(booking.location_reference);
    const googleMapsUrl = buildGoogleMapsUrl({
        lat: coords?.lat,
        lng: coords?.lng,
        address: booking.location_address,
        city: booking.location_city,
    });
    const openStreetMapUrl = coords
        ? buildOpenStreetMapUrl(coords.lat, coords.lng)
        : null;

    const counterpartLabel = role === "musician" ? "Cliente" : "Agrupación";
    const counterpartName =
        role === "musician" ? booking.contractor_name : booking.musician_name;
    const counterpartHref =
        role === "musician"
            ? booking.contractor_id
                ? `/contractors/${booking.contractor_id}`
                : null
            : booking.musician_id
              ? `/musicians/${booking.musician_id}`
              : null;

    const repertoire = booking.requested_repertoire ?? [];
    const description = booking.event_description?.trim() || null;
    const musicianNotes = booking.musician_quote_notes?.trim() || null;
    const rejectionReason = booking.rejection_reason?.trim() || null;

    return (
        <Card
            className={`relative shadow-soft border backdrop-blur-xl ${BOOKING_STATUS_TONE_CARD[tone]} ${
                isSidebar
                    ? "lg:overflow-y-auto lg:scrollbar-none lg:max-h-[calc(100dvh-var(--app-navbar-height)-var(--booking-timeline-height,0px)-1.5rem)]"
                    : "overflow-hidden"
            }`}
        >
            <div
                aria-hidden
                className={`absolute inset-y-0 left-0 w-1 ${BOOKING_STATUS_TONE_ACCENT_BAR[tone]}`}
            />

            <div className="pl-3.5 sm:pl-4">
                {/* 1. Identidad */}
                <header className="flex items-start gap-2 px-3 pt-3.5 pb-3">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-default-500">
                                    Detalle del compromiso
                                </p>
                                <h1
                                    className={`font-bold text-foreground tracking-tight text-balance ${
                                        isSidebar
                                            ? "text-lg sm:text-xl"
                                            : "text-xl sm:text-2xl"
                                    }`}
                                >
                                    {booking.event_type}
                                </h1>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                {hasPendingChanges ? (
                                    <Button
                                        color="warning"
                                        variant="solid"
                                        radius="lg"
                                        size="sm"
                                        aria-label="Revisar cambios pendientes"
                                        onPress={onReviewPending}
                                        className="font-semibold shadow-md animate-pulse min-w-0 px-2 sm:px-3"
                                        startContent={
                                            <Icon
                                                icon="material-symbols:pending-actions"
                                                width={18}
                                            />
                                        }
                                    >
                                        <span className="sm:hidden">Cambios</span>
                                        <span className="hidden sm:inline">
                                            Revisar cambios
                                        </span>
                                    </Button>
                                ) : canEdit ? (
                                    <Button
                                        isIconOnly
                                        variant="flat"
                                        color="primary"
                                        radius="lg"
                                        size="sm"
                                        aria-label="Editar compromiso"
                                        onPress={onEdit}
                                    >
                                        <Icon
                                            icon="material-symbols:edit"
                                            width={18}
                                        />
                                    </Button>
                                ) : null}
                                <Chip
                                    color={BOOKING_STATUS_COLORS[booking.status]}
                                    variant={getBookingStatusChipVariant(
                                        booking.status,
                                    )}
                                    size="sm"
                                >
                                    {BOOKING_STATUS_LABELS[booking.status]}
                                </Chip>
                            </div>
                        </div>
                    </div>
                </header>

                {rejectionReason ? (
                    <div className="mx-3 mb-3 rounded-2xl border border-danger/25 bg-danger/10 px-3 py-2.5">
                        <p className="text-xs font-semibold text-danger mb-1">
                            Motivo de rechazo
                        </p>
                        <p className="text-sm text-foreground whitespace-pre-wrap text-pretty">
                            {rejectionReason}
                        </p>
                    </div>
                ) : null}

                <div className="border-t border-default-200/60" />

                {/* 2. Contexto rápido: quién + cuándo */}
                <div
                    className={`px-3 py-3.5 grid gap-4 ${
                        isSidebar ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
                    }`}
                >
                    <Section title={counterpartLabel} icon="material-symbols:person">
                        {counterpartName ? (
                            counterpartHref ? (
                                <Link
                                    href={counterpartHref}
                                    className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-primary transition-colors"
                                >
                                    <span className="line-clamp-2">{counterpartName}</span>
                                    <Icon
                                        icon="material-symbols:open-in-new"
                                        width={14}
                                        className="text-default-400 shrink-0"
                                    />
                                </Link>
                            ) : (
                                <p className="font-semibold">{counterpartName}</p>
                            )
                        ) : (
                            <p className="text-default-500">Por confirmar</p>
                        )}
                    </Section>

                    <Section
                        title="Fecha y hora"
                        icon="material-symbols:calendar-month"
                    >
                        <div className="flex flex-col gap-1.5">
                            <p className="font-semibold inline-flex items-center gap-1.5">
                                <Icon
                                    icon="material-symbols:event"
                                    width={16}
                                    className={iconTone}
                                />
                                {formatBookingDate(booking.event_date)}
                            </p>
                            <p className="text-default-600 inline-flex items-center gap-1.5">
                                <Icon
                                    icon="material-symbols:schedule"
                                    width={16}
                                    className={iconTone}
                                />
                                {formatBookingTime(booking.start_time)}
                                {booking.end_time
                                    ? ` – ${formatBookingTime(booking.end_time)}`
                                    : ""}
                            </p>
                        </div>
                    </Section>
                </div>

                <div className="border-t border-default-200/50" />

                {/* 3. Ubicación */}
                <div className="px-3 py-3.5">
                    <Section title="Ubicación" icon="material-symbols:location-on">
                        <div className="rounded-2xl border border-default-200/70 bg-content1/70 p-3">
                            <p className="font-semibold leading-snug">
                                {booking.location_address || "Por confirmar"}
                            </p>
                            {booking.location_city ? (
                                <p className="text-sm text-default-600 mt-1">
                                    {booking.location_city}
                                </p>
                            ) : null}
                            {booking.location_reference && !coords ? (
                                <p className="text-xs text-default-500 mt-1.5">
                                    Ref.: {booking.location_reference}
                                </p>
                            ) : null}
                            {(googleMapsUrl || openStreetMapUrl) && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {googleMapsUrl ? (
                                        <Button
                                            as="a"
                                            href={googleMapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            size="sm"
                                            variant="flat"
                                            color="primary"
                                            radius="lg"
                                            className="h-8 min-w-0"
                                            startContent={
                                                <Icon
                                                    icon="material-symbols:map"
                                                    width={16}
                                                />
                                            }
                                        >
                                            Maps
                                        </Button>
                                    ) : null}
                                    {openStreetMapUrl ? (
                                        <Button
                                            as="a"
                                            href={openStreetMapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            size="sm"
                                            variant="bordered"
                                            radius="lg"
                                            className="h-8 min-w-0"
                                            startContent={
                                                <Icon
                                                    icon="material-symbols:public"
                                                    width={16}
                                                />
                                            }
                                        >
                                            OSM
                                        </Button>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </Section>
                </div>

                <div className="border-t border-default-200/50" />

                {/* 4. Contenido del evento */}
                <div className="px-3 py-3.5 flex flex-col gap-4">
                    <Section
                        title="Descripción del evento"
                        icon="material-symbols:description"
                    >
                        {description ? (
                            <p className="text-sm text-default-700 leading-relaxed whitespace-pre-wrap text-pretty">
                                {description}
                            </p>
                        ) : (
                            <p className="text-sm text-default-500 italic">
                                Sin descripción adicional.
                            </p>
                        )}
                    </Section>

                    {repertoire.length > 0 ? (
                        <Section
                            title="Temas solicitados"
                            icon="material-symbols:music-note"
                        >
                            <div className="flex flex-wrap gap-1.5">
                                {repertoire.map((title) => (
                                    <span
                                        key={title}
                                        className="inline-flex rounded-full bg-secondary/15 px-2.5 py-1 text-xs font-medium text-secondary"
                                    >
                                        {title}
                                    </span>
                                ))}
                            </div>
                        </Section>
                    ) : null}

                    <Section
                        title="Notas del músico"
                        icon="material-symbols:chat-info"
                    >
                        {musicianNotes ? (
                            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2.5">
                                <p className="text-sm text-default-700 leading-relaxed whitespace-pre-wrap text-pretty">
                                    {musicianNotes}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-default-500 italic">
                                El músico no agregó notas en la cotización.
                            </p>
                        )}
                    </Section>
                </div>

                {/* 5. Economía */}
                <div className="border-t border-default-200/60 px-3 py-3.5 bg-default-50/50">
                    <Section
                        title="Resumen económico"
                        icon="material-symbols:payments"
                        className="mb-0"
                    >
                        <div className="rounded-2xl border border-default-200/80 bg-content1 overflow-hidden">
                            <div className="flex flex-col gap-2.5 px-3.5 py-3">
                                <MoneyRow
                                    label={
                                        role === "contractor"
                                            ? "Precio del servicio"
                                            : "Precio acordado"
                                    }
                                    value={
                                        servicePrice != null
                                            ? formatCurrency(servicePrice)
                                            : "Pendiente"
                                    }
                                    tone={
                                        servicePrice != null ? "default" : "muted"
                                    }
                                />
                                {role === "contractor" && fee > 0 ? (
                                    <MoneyRow
                                        label="Tarifa de servicio"
                                        hint="Incluye costos de procesamiento"
                                        value={formatCurrency(fee)}
                                        tone="muted"
                                    />
                                ) : null}
                            </div>

                            {role === "contractor" &&
                            contractorTotal != null &&
                            fee > 0 ? (
                                <div className="border-t border-default-200/70 bg-primary/5 px-3.5 py-3">
                                    <MoneyRow
                                        label="Total a pagar"
                                        hint="Servicio + tarifas"
                                        value={formatCurrency(contractorTotal)}
                                        tone="emphasis"
                                    />
                                </div>
                            ) : null}
                        </div>
                    </Section>
                </div>
            </div>
        </Card>
    );
}
