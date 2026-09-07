"use client";

import { FormEvent, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    Checkbox,
    Chip,
    Input,
    Select,
    SelectItem,
    addToast,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import FileUploadField from "@/components/ui/file-upload-field";
import SignaturePad from "@/components/ui/signature-pad";
import BookingDocumentsCard from "@/components/booking/booking-documents-card";
import { attachContractorSignature } from "@/lib/bookings";
import {
    contractorAdvanceDue,
    contractorPayableTotal,
} from "@/lib/platform-fee";
import { uploadSignatureDataUrl } from "@/lib/uploads";
import type { BookingOut } from "@/types/api";

type Props = {
    booking: BookingOut;
    onUpdated: (booking: BookingOut) => void;
};

export default function MusicianAttachSignatureCard({
    booking,
    onUpdated,
}: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
    const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
    const [paymentAmount, setPaymentAmount] = useState(() => {
        const advanceDue = contractorAdvanceDue(booking);
        const fullDue = contractorPayableTotal(booking);
        if (booking.advance_amount != null && advanceDue != null) {
            return String(advanceDue);
        }
        return fullDue != null ? String(fullDue) : "";
    });
    const [paymentType, setPaymentType] = useState<"advance" | "full">(
        booking.advance_amount != null ? "advance" : "full",
    );
    const advanceDue = contractorAdvanceDue(booking);
    const contractorTotal = contractorPayableTotal(booking);
    const [markValidated, setMarkValidated] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (!termsAccepted) {
            addToast({
                title: "Confirmación requerida",
                description:
                    "Confirma que el contratista aceptó los términos del contrato.",
                color: "warning",
            });
            return;
        }
        if (!signatureDataUrl) {
            addToast({
                title: "Firma requerida",
                description: "Adjunta la firma del contratista.",
                color: "warning",
            });
            return;
        }
        const hasEvidence = evidenceUrls.length > 0;
        if (hasEvidence || markValidated) {
            const amount = Number(paymentAmount);
            if (!amount || amount <= 0) {
                addToast({
                    title: "Monto inválido",
                    description: "Indica el monto pagado para regularizar.",
                    color: "warning",
                });
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const signatureImageUrl = await uploadSignatureDataUrl(
                signatureDataUrl,
                "firma-contratista",
            );
            const updated = await attachContractorSignature(booking.id, {
                signature_image_url: signatureImageUrl,
                terms_accepted: true,
                payment_evidence_urls: hasEvidence ? evidenceUrls : undefined,
                payment_evidence_url: hasEvidence ? evidenceUrls[0] : null,
                payment_amount:
                    hasEvidence || markValidated ? Number(paymentAmount) : null,
                payment_type: hasEvidence || markValidated ? paymentType : null,
                mark_payment_validated: markValidated,
            });
            onUpdated(updated);
            addToast({
                title: "Contrato regularizado",
                description: "La firma del contratista quedó registrada en el PDF.",
                color: "success",
            });
        } catch (error) {
            addToast({
                title: "No se pudo adjuntar",
                description:
                    error instanceof Error ? error.message : "Intenta de nuevo.",
                color: "danger",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <BookingDocumentsCard
                booking={booking}
                title="Contrato pendiente de firma"
                description="Puedes esperar la firma del contratista o adjuntarla aquí para regularizar la contrata."
                showPaymentDetails={false}
            />

            <Card className="border border-warning/30 shadow-soft overflow-hidden">
                <div className="bg-gradient-to-br from-warning/10 via-warning/5 to-transparent px-6 py-5">
                    <Chip color="warning" variant="flat" size="sm" className="mb-3">
                        Regularizar
                    </Chip>
                    <h2 className="text-xl font-bold text-foreground">
                        Adjuntar firma del contratista
                    </h2>
                    <p className="text-sm text-default-600 mt-2 max-w-2xl">
                        Si ya firmó en persona, captura su firma y opcionalmente el
                        comprobante para avanzar la reserva.
                    </p>
                </div>
                <CardBody className="p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <SignaturePad
                            value={signatureDataUrl}
                            onChange={setSignatureDataUrl}
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
                            />
                            <Select
                                label="Tipo de pago"
                                selectedKeys={[paymentType]}
                                onSelectionChange={(keys) => {
                                    const value = Array.from(keys)[0];
                                    if (value === "advance" || value === "full") {
                                        setPaymentType(value);
                                        if (value === "advance" && advanceDue != null) {
                                            setPaymentAmount(String(advanceDue));
                                        } else if (
                                            value === "full" &&
                                            contractorTotal != null
                                        ) {
                                            setPaymentAmount(String(contractorTotal));
                                        }
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
                            isSelected={termsAccepted}
                            onValueChange={setTermsAccepted}
                        >
                            El contratista aceptó los términos del contrato
                        </Checkbox>
                        <Checkbox
                            isSelected={markValidated}
                            onValueChange={setMarkValidated}
                        >
                            El pago ya fue recibido y validado
                        </Checkbox>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                color="warning"
                                radius="lg"
                                className="font-semibold"
                                isLoading={isSubmitting}
                                startContent={
                                    isSubmitting ? undefined : (
                                        <Icon
                                            icon="material-symbols:draw"
                                            width={18}
                                        />
                                    )
                                }
                            >
                                Guardar firma y regularizar
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
