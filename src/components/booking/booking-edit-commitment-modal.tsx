"use client";

import { FormEvent, useEffect, useState } from "react";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
    addToast,
} from "@heroui/react";
import LocationMapPickerField, { type MapLocation } from "@/components/ui/location-map-picker-field";
import { formatCurrency } from "@/lib/booking-labels";
import { requestBookingChange } from "@/lib/bookings";
import {
    formatLocationReference,
    parseLocationReference,
} from "@/lib/geocoding";
import type { BookingOut, UserRole } from "@/types/api";

type Role = Extract<UserRole, "musician" | "contractor">;

type Props = {
    booking: BookingOut;
    role: Role;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdated: (booking: BookingOut) => void;
    /** Adelanto ya validado (pagos retained/released). No editable. */
    validatedAdvance?: number | null;
};

function locationFromBooking(booking: BookingOut): MapLocation | null {
    const coords = parseLocationReference(booking.location_reference);
    if (!coords) return null;
    return {
        address: booking.location_address,
        city: booking.location_city,
        lat: coords.lat,
        lng: coords.lng,
    };
}

export default function BookingEditCommitmentModal({
    booking,
    role,
    isOpen,
    onOpenChange,
    onUpdated,
    validatedAdvance = null,
}: Props) {
    const isMusician = role === "musician";
    const formId = "edit-commitment-form";
    const [address, setAddress] = useState(booking.location_address);
    const [city, setCity] = useState(booking.location_city ?? "");
    const [reference, setReference] = useState("");
    const [location, setLocation] = useState<MapLocation | null>(null);
    const [description, setDescription] = useState(booking.event_description ?? "");
    const [priceInput, setPriceInput] = useState(
        booking.price_agreed != null ? String(Number(booking.price_agreed)) : "",
    );
    const [advanceInput, setAdvanceInput] = useState(
        booking.advance_amount != null ? String(Number(booking.advance_amount)) : "",
    );
    const [changeNotes, setChangeNotes] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [mapMountKey, setMapMountKey] = useState(0);

    useEffect(() => {
        if (!isOpen) return;
        setAddress(booking.location_address);
        setCity(booking.location_city ?? "");
        const coords = parseLocationReference(booking.location_reference);
        setReference(coords ? "" : (booking.location_reference ?? ""));
        setLocation(locationFromBooking(booking));
        setDescription(booking.event_description ?? "");
        setPriceInput(
            booking.price_agreed != null ? String(Number(booking.price_agreed)) : "",
        );
        setAdvanceInput(
            booking.advance_amount != null ? String(Number(booking.advance_amount)) : "",
        );
        setChangeNotes("");
        // Remonta el mapa al abrir para evitar tiles grises / área invisible en el modal.
        setMapMountKey((current) => current + 1);
    }, [booking, isOpen]);

    function handleLocationChange(next: MapLocation) {
        setLocation(next);
        setAddress(next.address);
        setCity(next.city ?? "");
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (!address.trim()) {
            addToast({
                title: "Dirección requerida",
                description: "Indica la dirección del evento.",
                color: "warning",
            });
            return;
        }

        if (isMusician) {
            const price = priceInput ? Number(priceInput) : null;
            const advance = advanceInput ? Number(advanceInput) : null;
            if (price != null && (!Number.isFinite(price) || price <= 0)) {
                addToast({
                    title: "Precio inválido",
                    description: "Indica un precio acordado válido.",
                    color: "warning",
                });
                return;
            }
            if (
                validatedAdvance != null &&
                price != null &&
                price < validatedAdvance
            ) {
                addToast({
                    title: "Precio inválido",
                    description:
                        "El precio no puede ser menor al adelanto ya validado.",
                    color: "warning",
                });
                return;
            }
            if (advance != null && price != null && advance > price) {
                addToast({
                    title: "Anticipo inválido",
                    description: "El anticipo no puede superar el precio acordado.",
                    color: "warning",
                });
                return;
            }
        }

        const locationReference = location
            ? formatLocationReference(location.lat, location.lng)
            : reference.trim() || null;

        setIsSaving(true);
        try {
            const updated = await requestBookingChange(booking.id, {
                location_address: address.trim(),
                location_city: city.trim() || null,
                location_reference: locationReference,
                event_description: description.trim() || null,
                change_notes: changeNotes.trim() || null,
                ...(isMusician
                    ? {
                          price_agreed: priceInput ? Number(priceInput) : null,
                          advance_amount: advanceInput ? Number(advanceInput) : null,
                      }
                    : {}),
            });
            onUpdated(updated);
            onOpenChange(false);
            addToast({
                title: isMusician ? "Compromiso actualizado" : "Cambio enviado",
                description: isMusician
                    ? "Se notificó al contratista. No requiere validación."
                    : "El músico debe aceptar o rechazar. No se vuelve a firmar.",
                color: "success",
            });
        } catch (error) {
            addToast({
                title: isMusician
                    ? "No se pudo actualizar"
                    : "No se pudo solicitar el cambio",
                description: error instanceof Error ? error.message : "Intenta de nuevo.",
                color: "danger",
            });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="3xl"
            scrollBehavior="inside"
            placement="center"
            classNames={{
                base: "mx-2 sm:mx-auto max-w-[calc(100vw-1rem)] sm:max-w-3xl max-h-[92vh]",
                wrapper: "items-end sm:items-center",
                body: "px-4 sm:px-6 py-2",
                header: "px-4 sm:px-6",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col items-start gap-1 pb-2">
                            <span className="text-xl font-bold">
                                Editar compromiso
                            </span>
                            <span className="text-sm font-normal text-default-500">
                                {isMusician
                                    ? "Los cambios se aplican de inmediato y se notifican al contratista."
                                    : "Tus cambios quedarán pendientes de validación del músico."}
                            </span>
                        </ModalHeader>
                        <ModalBody>
                            <form
                                id={formId}
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-4"
                            >
                                <Input
                                    label="Dirección"
                                    value={address}
                                    onValueChange={setAddress}
                                    variant="bordered"
                                    isRequired
                                />
                                <Input
                                    label="Ciudad"
                                    value={city}
                                    onValueChange={setCity}
                                    variant="bordered"
                                />
                                <div className="relative z-10">
                                    <p className="text-sm font-semibold text-foreground mb-2">
                                        Ubicación en el mapa
                                    </p>
                                    {isOpen ? (
                                        <LocationMapPickerField
                                            key={`edit-map-${booking.id}-${mapMountKey}`}
                                            value={location}
                                            onChange={handleLocationChange}
                                        />
                                    ) : null}
                                </div>
                                {!location ? (
                                    <Input
                                        label="Referencia"
                                        value={reference}
                                        onValueChange={setReference}
                                        variant="bordered"
                                        description="Indicaciones de llegada o coordenadas si no marcas el mapa."
                                    />
                                ) : null}
                                <Textarea
                                    label="Descripción del evento"
                                    value={description}
                                    onValueChange={setDescription}
                                    variant="bordered"
                                    minRows={2}
                                />

                                {isMusician ? (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Input
                                                label="Precio acordado (S/)"
                                                type="number"
                                                min="1"
                                                value={priceInput}
                                                onValueChange={setPriceInput}
                                                variant="bordered"
                                            />
                                            <Input
                                                label="Anticipo acordado (S/)"
                                                type="number"
                                                min="0"
                                                value={advanceInput}
                                                onValueChange={setAdvanceInput}
                                                variant="bordered"
                                                description="Figura contractual. No altera el adelanto ya validado."
                                            />
                                        </div>
                                        {validatedAdvance != null &&
                                        validatedAdvance > 0 ? (
                                            <div className="rounded-2xl border border-success/30 bg-success/5 px-4 py-3">
                                                <p className="text-xs font-semibold text-success mb-1">
                                                    Adelanto validado (no editable)
                                                </p>
                                                <p className="text-sm text-foreground font-semibold">
                                                    {formatCurrency(validatedAdvance)}
                                                </p>
                                                <p className="text-xs text-default-500 mt-1">
                                                    Este monto ya fue retenido y no se
                                                    puede modificar desde aquí.
                                                </p>
                                            </div>
                                        ) : null}
                                    </>
                                ) : null}

                                <Textarea
                                    label={
                                        isMusician
                                            ? "Notas (opcional)"
                                            : "Notas del cambio (opcional)"
                                    }
                                    value={changeNotes}
                                    onValueChange={setChangeNotes}
                                    variant="bordered"
                                    minRows={2}
                                    description={
                                        isMusician
                                            ? "Información adicional para el contratista."
                                            : "Mensaje que verá el músico al revisar tu propuesta."
                                    }
                                />
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="flat"
                                radius="lg"
                                onPress={onClose}
                                isDisabled={isSaving}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                form={formId}
                                color={isMusician ? "primary" : "secondary"}
                                radius="lg"
                                className="font-semibold"
                                isLoading={isSaving}
                            >
                                {isMusician
                                    ? "Guardar y notificar"
                                    : "Enviar para validación"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
