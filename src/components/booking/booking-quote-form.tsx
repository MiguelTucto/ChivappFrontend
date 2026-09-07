"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Input,
    Textarea,
    addToast,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { quoteBooking, rejectBooking } from "@/lib/bookings";
import { formatCurrency, formatQuotedAt } from "@/lib/booking-labels";
import { getPlatformPaymentInstructions } from "@/lib/payments";
import { platformFeeAmount } from "@/lib/platform-fee";
import type { BookingOut } from "@/types/api";

function roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
}

type Props = {
    booking: BookingOut;
    onUpdated: (booking: BookingOut) => void;
};

export default function BookingQuoteForm({ booking, onUpdated }: Props) {
    const isEditMode = booking.status === "accepted";
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [priceAgreed, setPriceAgreed] = useState("");
    const [advanceAmount, setAdvanceAmount] = useState("");
    const [quoteNotes, setQuoteNotes] = useState("");
    const [locationAddress, setLocationAddress] = useState(booking.location_address);
    const [locationCity, setLocationCity] = useState(booking.location_city ?? "");
    const [locationReference, setLocationReference] = useState(
        booking.location_reference ?? "",
    );
    const [platformFeePercent, setPlatformFeePercent] = useState<number>(
        booking.platform_fee_percent != null
            ? Number(booking.platform_fee_percent)
            : 2,
    );

    useEffect(() => {
        setPriceAgreed(
            booking.price_agreed != null ? String(Number(booking.price_agreed)) : "",
        );
        setAdvanceAmount(
            booking.advance_amount != null ? String(Number(booking.advance_amount)) : "",
        );
        setQuoteNotes(booking.musician_quote_notes ?? "");
        setLocationAddress(booking.location_address);
        setLocationCity(booking.location_city ?? "");
        setLocationReference(booking.location_reference ?? "");
        if (booking.platform_fee_percent != null) {
            setPlatformFeePercent(Number(booking.platform_fee_percent));
        }
    }, [booking]);

    useEffect(() => {
        let cancelled = false;
        getPlatformPaymentInstructions()
            .then((data) => {
                if (cancelled) return;
                if (booking.platform_fee_percent == null) {
                    setPlatformFeePercent(Number(data.platform_fee_percent ?? 2));
                }
            })
            .catch(() => {
                // Keep local/default percent if instructions are unavailable.
            });
        return () => {
            cancelled = true;
        };
    }, [booking.platform_fee_percent]);

    const pricePreview = Number(priceAgreed);
    const advancePreview = Number(advanceAmount);
    const feePreview = useMemo(() => {
        if (!pricePreview || pricePreview <= 0) return 0;
        return platformFeeAmount({
            price_agreed: pricePreview,
            platform_fee_percent: platformFeePercent,
            platform_fee_amount: null,
        });
    }, [pricePreview, platformFeePercent]);
    const contractorTotalPreview =
        pricePreview > 0 ? roundMoney(pricePreview + feePreview) : null;
    const hasValidAdvance =
        advanceAmount !== "" &&
        !Number.isNaN(advancePreview) &&
        advancePreview >= 0 &&
        pricePreview > 0 &&
        advancePreview <= pricePreview;
    const remainingPreview =
        contractorTotalPreview != null && hasValidAdvance
            ? roundMoney(contractorTotalPreview - advancePreview)
            : null;

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const price = Number(priceAgreed);
        if (!price || price <= 0) {
            addToast({
                title: "Precio requerido",
                description: "Indica un precio válido para tu cotización.",
                color: "warning",
            });
            return;
        }

        if (advanceAmount) {
            const advance = Number(advanceAmount);
            if (advance < 0 || advance > price) {
                addToast({
                    title: "Anticipo inválido",
                    description:
                        "El anticipo debe ser mayor o igual a 0 y no superar el precio total.",
                    color: "warning",
                });
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const updated = await quoteBooking(booking.id, {
                price_agreed: price,
                advance_amount: advanceAmount ? Number(advanceAmount) : null,
                musician_quote_notes: quoteNotes.trim() || null,
                location_address: locationAddress.trim() || null,
                location_city: locationCity.trim() || null,
                location_reference: locationReference.trim() || null,
            });
            onUpdated(updated);
            addToast({
                title: isEditMode ? "Cotización actualizada" : "Cotización enviada",
                description: isEditMode
                    ? "El contratista fue notificado sobre los cambios en tu propuesta."
                    : "El contratista fue notificado para revisar tu propuesta.",
                color: "success",
            });
        } catch (error) {
            addToast({
                title: "No se pudo enviar",
                description: error instanceof Error ? error.message : "Intenta de nuevo.",
                color: "danger",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleReject() {
        if (isEditMode) return;

        setIsRejecting(true);
        try {
            const updated = await rejectBooking(booking.id);
            onUpdated(updated);
            addToast({ title: "Solicitud rechazada", color: "success" });
        } catch (error) {
            addToast({
                title: "Error",
                description: error instanceof Error ? error.message : "Intenta de nuevo.",
                color: "danger",
            });
        } finally {
            setIsRejecting(false);
        }
    }

    const quotedAtLabel = formatQuotedAt(booking.quoted_at);

    return (
        <Card className="border border-primary/20 bg-primary/5 shadow-soft">
            <CardHeader className="flex flex-col items-start gap-2 px-6 pt-6 pb-0">
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">
                        {isEditMode ? "Editar cotización" : "Responder solicitud"}
                    </h2>
                    {isEditMode ? (
                        <Chip size="sm" color="primary" variant="flat">
                            En revisión del contratista
                        </Chip>
                    ) : null}
                </div>
                <p className="text-sm text-default-500">
                    {isEditMode
                        ? "Puedes ajustar tu propuesta mientras el contratista no la haya aceptado. Cada cambio genera una nueva alerta."
                        : "Indica tu precio y qué información adicional necesitas del contratista."}
                </p>
                {isEditMode && quotedAtLabel ? (
                    <p className="text-xs text-default-400">
                        Última actualización: {quotedAtLabel}
                    </p>
                ) : null}
            </CardHeader>
            <CardBody className="px-6 pb-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Precio del servicio (S/)"
                            type="number"
                            min="1"
                            value={priceAgreed}
                            onValueChange={setPriceAgreed}
                            variant="bordered"
                            isRequired
                            description="Lo que tú recibes por el servicio."
                        />
                        <Input
                            label="Anticipo sugerido (S/)"
                            type="number"
                            min="0"
                            value={advanceAmount}
                            onValueChange={setAdvanceAmount}
                            variant="bordered"
                            description="Opcional. Monto inicial del servicio que solicitas."
                        />
                    </div>
                    {contractorTotalPreview != null ? (
                        <div className="rounded-2xl border border-primary/20 bg-content1 px-4 py-3 text-sm flex flex-col gap-2">
                            <p className="font-semibold text-foreground">
                                El contratista pagará{" "}
                                <span className="text-primary">
                                    {formatCurrency(contractorTotalPreview)}
                                </span>
                            </p>
                            <p className="text-default-500">
                                Servicio {formatCurrency(pricePreview)}
                                {feePreview > 0
                                    ? ` + comisión plataforma ${platformFeePercent}% (${formatCurrency(feePreview)})`
                                    : " · sin comisión de plataforma"}
                                . Tú recibes el precio del servicio íntegro.
                            </p>
                            {hasValidAdvance ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-primary/10">
                                    <p className="text-default-600">
                                        Anticipo a transferir:{" "}
                                        <span className="font-semibold text-foreground">
                                            {formatCurrency(advancePreview)}
                                        </span>
                                    </p>
                                    <p className="text-default-600">
                                        Saldo restante:{" "}
                                        <span className="font-semibold text-foreground">
                                            {formatCurrency(remainingPreview ?? 0)}
                                        </span>
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                    <Textarea
                        label="Información adicional requerida"
                        placeholder="Ej. Necesito la dirección exacta con referencia, acceso para equipo, número de asistentes..."
                        value={quoteNotes}
                        onValueChange={setQuoteNotes}
                        variant="bordered"
                        minRows={3}
                    />
                    <div className="rounded-2xl border border-default-200 bg-content1 p-4 flex flex-col gap-3">
                        <p className="text-sm font-semibold text-foreground">
                            Ubicación del evento (puedes solicitar más detalle)
                        </p>
                        <Input
                            label="Dirección"
                            value={locationAddress}
                            onValueChange={setLocationAddress}
                            variant="bordered"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                                label="Ciudad"
                                value={locationCity}
                                onValueChange={setLocationCity}
                                variant="bordered"
                            />
                            <Input
                                label="Referencia"
                                value={locationReference}
                                onValueChange={setLocationReference}
                                variant="bordered"
                                description="Coordenadas o referencia adicional."
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                        <Button
                            type="submit"
                            color="primary"
                            radius="lg"
                            isLoading={isSubmitting}
                            className="font-semibold"
                            startContent={
                                <Icon
                                    icon={
                                        isEditMode
                                            ? "material-symbols:save"
                                            : "material-symbols:send"
                                    }
                                    width={18}
                                />
                            }
                        >
                            {isEditMode ? "Actualizar cotización" : "Enviar cotización"}
                        </Button>
                        {!isEditMode ? (
                            <Button
                                color="danger"
                                variant="flat"
                                radius="lg"
                                isLoading={isRejecting}
                                onPress={handleReject}
                            >
                                Rechazar solicitud
                            </Button>
                        ) : null}
                    </div>
                </form>
            </CardBody>
        </Card>
    );
}
