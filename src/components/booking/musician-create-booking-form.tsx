"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
    Button,
    Checkbox,
    Divider,
    Input,
    Select,
    SelectItem,
    Textarea,
    addToast,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import FileUploadField from "@/components/ui/file-upload-field";
import LocationMapPickerField, { type MapLocation } from "@/components/ui/location-map-picker-field";
import SignaturePad from "@/components/ui/signature-pad";
import { createMusicianBooking } from "@/lib/bookings";
import {
    formatLocationReference,
    getMinEventDate,
    normalizeStartTime,
    validateBookingRequest,
} from "@/lib/geocoding";
import { uploadSignatureDataUrl } from "@/lib/uploads";

const EVENT_TYPES = [
    "Boda",
    "Quinceañero",
    "Cumpleaños",
    "Aniversario",
    "Evento corporativo",
    "Serenata",
    "Otro",
];

const DOCUMENT_TYPES = ["DNI", "CE", "Pasaporte", "RUC", "Otro"];

type Props = {
    onSuccess?: () => void;
};

export default function MusicianCreateBookingForm({ onSuccess }: Props) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [contractorFullname, setContractorFullname] = useState("");
    const [contractorEmail, setContractorEmail] = useState("");
    const [contractorPhone, setContractorPhone] = useState("");
    const [documentType, setDocumentType] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    const [contractorAddress, setContractorAddress] = useState("");
    const [contractorCity, setContractorCity] = useState("");

    const [eventDate, setEventDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [eventType, setEventType] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [location, setLocation] = useState<MapLocation | null>(null);

    const [priceAgreed, setPriceAgreed] = useState("");
    const [advanceAmount, setAdvanceAmount] = useState("");
    const [quoteNotes, setQuoteNotes] = useState("");

    const [attachSignature, setAttachSignature] = useState(false);
    const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
    const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentType, setPaymentType] = useState<"advance" | "full">("advance");
    const [markValidated, setMarkValidated] = useState(false);

    const minEventDate = useMemo(() => getMinEventDate(), []);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (!contractorFullname.trim()) {
            addToast({
                title: "Nombre requerido",
                description: "Indica el nombre del contratista.",
                color: "warning",
            });
            return;
        }

        const validationError = validateBookingRequest({
            eventDate,
            startTime,
            eventType,
            location,
        });
        if (validationError) {
            addToast({
                title: "Campos incompletos",
                description: validationError,
                color: "warning",
            });
            return;
        }

        const price = Number(priceAgreed);
        if (!price || price <= 0) {
            addToast({
                title: "Precio requerido",
                description: "Indica el precio total de la contrata.",
                color: "warning",
            });
            return;
        }

        let advance: number | null = null;
        if (advanceAmount.trim()) {
            advance = Number(advanceAmount);
            if (Number.isNaN(advance) || advance < 0 || advance > price) {
                addToast({
                    title: "Anticipo inválido",
                    description: "El anticipo debe ser ≥ 0 y no superar el precio total.",
                    color: "warning",
                });
                return;
            }
        }

        const willAttachSignature = Boolean(signatureDataUrl);
        const hasEvidence = evidenceUrls.length > 0;
        if (willAttachSignature && (hasEvidence || markValidated)) {
            const amount = Number(paymentAmount || advanceAmount || priceAgreed);
            if (!amount || amount <= 0) {
                addToast({
                    title: "Monto de pago",
                    description: "Indica el monto pagado para regularizar.",
                    color: "warning",
                });
                return;
            }
        }

        setIsSubmitting(true);
        try {
            let signatureUrl: string | null = null;
            if (willAttachSignature && signatureDataUrl) {
                signatureUrl = await uploadSignatureDataUrl(
                    signatureDataUrl,
                    "firma-contratista",
                );
            }

            const booking = await createMusicianBooking({
                contractor_fullname: contractorFullname.trim(),
                contractor_email: contractorEmail.trim().toLowerCase() || null,
                contractor_phone: contractorPhone.trim() || null,
                document_type: documentType || null,
                document_number: documentNumber.trim() || null,
                contractor_address: contractorAddress.trim() || null,
                contractor_city: contractorCity.trim() || null,
                event_date: eventDate,
                start_time: normalizeStartTime(startTime),
                end_time: null,
                location_address: location!.address,
                location_city: location!.city,
                location_reference: formatLocationReference(location!.lat, location!.lng),
                event_type: eventType,
                event_description: eventDescription.trim() || null,
                price_agreed: price,
                advance_amount: advance,
                musician_quote_notes: quoteNotes.trim() || null,
                contractor_signature_url: signatureUrl,
                payment_evidence_urls:
                    willAttachSignature && hasEvidence ? evidenceUrls : undefined,
                payment_evidence_url:
                    willAttachSignature && hasEvidence ? evidenceUrls[0] : null,
                payment_amount:
                    willAttachSignature && (hasEvidence || markValidated)
                        ? Number(paymentAmount || advanceAmount || priceAgreed)
                        : null,
                payment_type: willAttachSignature ? paymentType : null,
                mark_payment_validated: willAttachSignature ? markValidated : false,
            });

            addToast({
                title: "Contrata creada",
                description: signatureUrl
                    ? "La reserva se creó y la firma del contratista quedó registrada."
                    : "La reserva quedó creada. Puedes adjuntar la firma después si lo necesitas.",
                color: "success",
            });
            onSuccess?.();
            router.push(`/musician/bookings/${booking.id}`);
        } catch (error) {
            addToast({
                title: "No se pudo crear",
                description:
                    error instanceof Error ? error.message : "Intenta de nuevo.",
                color: "danger",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <section className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Icon icon="material-symbols:person" width={20} className="text-primary" />
                    <h3 className="font-semibold text-foreground">Datos del contratista</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                        label="Nombre completo"
                        isRequired
                        value={contractorFullname}
                        onValueChange={setContractorFullname}
                        variant="bordered"
                        radius="lg"
                    />
                    <Input
                        label="Correo (opcional)"
                        type="email"
                        value={contractorEmail}
                        onValueChange={setContractorEmail}
                        variant="bordered"
                        radius="lg"
                    />
                    <Input
                        label="Teléfono (opcional)"
                        value={contractorPhone}
                        onValueChange={setContractorPhone}
                        variant="bordered"
                        radius="lg"
                    />
                    <Select
                        label="Tipo de documento (opcional)"
                        selectedKeys={documentType ? [documentType] : []}
                        onSelectionChange={(keys) => {
                            const value = Array.from(keys)[0];
                            setDocumentType(value ? String(value) : "");
                        }}
                        variant="bordered"
                        radius="lg"
                    >
                        {DOCUMENT_TYPES.map((type) => (
                            <SelectItem key={type}>{type}</SelectItem>
                        ))}
                    </Select>
                    <Input
                        label="Número de documento (opcional)"
                        value={documentNumber}
                        onValueChange={setDocumentNumber}
                        variant="bordered"
                        radius="lg"
                    />
                    <Input
                        label="Ciudad del cliente (opcional)"
                        value={contractorCity}
                        onValueChange={setContractorCity}
                        variant="bordered"
                        radius="lg"
                    />
                    <Input
                        className="sm:col-span-2"
                        label="Dirección del cliente (opcional)"
                        value={contractorAddress}
                        onValueChange={setContractorAddress}
                        variant="bordered"
                        radius="lg"
                    />
                </div>
            </section>

            <Divider />

            <section className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Icon icon="material-symbols:event" width={20} className="text-primary" />
                    <h3 className="font-semibold text-foreground">Evento y lugar</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                        label="Fecha del evento"
                        type="date"
                        isRequired
                        min={minEventDate}
                        value={eventDate}
                        onValueChange={setEventDate}
                        variant="bordered"
                        radius="lg"
                    />
                    <Input
                        label="Hora de inicio"
                        type="time"
                        isRequired
                        value={startTime}
                        onValueChange={setStartTime}
                        variant="bordered"
                        radius="lg"
                    />
                    <Select
                        className="sm:col-span-2"
                        label="Tipo de evento"
                        isRequired
                        selectedKeys={eventType ? [eventType] : []}
                        onSelectionChange={(keys) => {
                            const value = Array.from(keys)[0];
                            setEventType(value ? String(value) : "");
                        }}
                        variant="bordered"
                        radius="lg"
                    >
                        {EVENT_TYPES.map((type) => (
                            <SelectItem key={type}>{type}</SelectItem>
                        ))}
                    </Select>
                </div>
                <LocationMapPickerField value={location} onChange={setLocation} />
                <Textarea
                    label="Descripción del evento (opcional)"
                    value={eventDescription}
                    onValueChange={setEventDescription}
                    variant="bordered"
                    radius="lg"
                    minRows={2}
                />
            </section>

            <Divider />

            <section className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Icon icon="material-symbols:payments" width={20} className="text-primary" />
                    <h3 className="font-semibold text-foreground">Precio y anticipo</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                        label="Precio total"
                        type="number"
                        min={1}
                        step="0.01"
                        isRequired
                        value={priceAgreed}
                        onValueChange={setPriceAgreed}
                        variant="bordered"
                        radius="lg"
                        startContent={<span className="text-default-400 text-sm">S/</span>}
                    />
                    <Input
                        label="Anticipo (opcional)"
                        type="number"
                        min={0}
                        step="0.01"
                        value={advanceAmount}
                        onValueChange={(value) => {
                            setAdvanceAmount(value);
                            if (!paymentAmount) setPaymentAmount(value);
                        }}
                        variant="bordered"
                        radius="lg"
                        startContent={<span className="text-default-400 text-sm">S/</span>}
                    />
                </div>
                <Textarea
                    label="Notas / condiciones (opcional)"
                    value={quoteNotes}
                    onValueChange={setQuoteNotes}
                    variant="bordered"
                    radius="lg"
                    minRows={2}
                    placeholder="Detalle de horas, repertorio, condiciones especiales…"
                />
            </section>

            <Divider />

            <section className="flex flex-col gap-3">
                <Checkbox
                    isSelected={attachSignature}
                    onValueChange={(checked) => {
                        setAttachSignature(checked);
                        if (!checked) {
                            setSignatureDataUrl(null);
                            setEvidenceUrls([]);
                            setMarkValidated(false);
                        }
                    }}
                >
                    Regularizar ahora con firma (opcional)
                </Checkbox>
                <p className="text-xs text-default-500">
                    No es obligatorio. Si no firmas ahora, podrás adjuntar la firma del
                    contratista después desde el detalle de la reserva.
                </p>

                {attachSignature ? (
                    <div className="flex flex-col gap-4 rounded-2xl border border-default-200 p-4 bg-content1">
                        <SignaturePad
                            value={signatureDataUrl}
                            onChange={setSignatureDataUrl}
                            label="Firma del contratista (opcional)"
                            helperText="Si la dejas vacía, la contrata se crea igual y podrás firmar luego."
                        />
                        <FileUploadField
                            multiple
                            label="Comprobantes de pago (opcional)"
                            value={evidenceUrls}
                            onChange={setEvidenceUrls}
                            helperText="Puedes subir varios archivos. Las imágenes se optimizan al cargar."
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                                label="Monto pagado"
                                type="number"
                                min={0}
                                step="0.01"
                                value={paymentAmount}
                                onValueChange={setPaymentAmount}
                                variant="bordered"
                                radius="lg"
                                startContent={
                                    <span className="text-default-400 text-sm">S/</span>
                                }
                            />
                            <Select
                                label="Tipo de pago"
                                selectedKeys={[paymentType]}
                                onSelectionChange={(keys) => {
                                    const value = Array.from(keys)[0];
                                    if (value === "advance" || value === "full") {
                                        setPaymentType(value);
                                    }
                                }}
                                variant="bordered"
                                radius="lg"
                            >
                                <SelectItem key="advance">Anticipo</SelectItem>
                                <SelectItem key="full">Pago total</SelectItem>
                            </Select>
                        </div>
                        <Checkbox
                            isSelected={markValidated}
                            onValueChange={setMarkValidated}
                        >
                            El pago ya fue recibido y validado (reserva confirmada)
                        </Checkbox>
                    </div>
                ) : null}
            </section>

            <div className="flex justify-end gap-2">
                <Button
                    type="submit"
                    color="primary"
                    radius="lg"
                    className="font-semibold"
                    isLoading={isSubmitting}
                    startContent={
                        isSubmitting ? undefined : (
                            <Icon icon="material-symbols:add-circle" width={18} />
                        )
                    }
                >
                    Crear contrata
                </Button>
            </div>
        </form>
    );
}
