"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { resolveUploadUrl, toAbsoluteUploadUrl } from "@/lib/uploads";

type Props = {
    pdfUrl: string | null;
    title?: string;
    description?: string;
    isLoading?: boolean;
};

function useAvailabilityProbe(resolvedUrl: string | null) {
    const [unavailable, setUnavailable] = useState(false);

    useEffect(() => {
        if (!resolvedUrl) return;

        let cancelled = false;
        fetch(resolvedUrl, { method: "GET", credentials: "omit" })
            .then((res) => {
                if (!cancelled && (res.status === 404 || res.status === 410)) {
                    setUnavailable(true);
                }
            })
            .catch(() => {
                // Ignore network/CORS probe failures; still show open/download.
            });

        return () => {
            cancelled = true;
        };
    }, [resolvedUrl]);

    return unavailable;
}

function ContractPdfViewerLoaded({
    resolvedUrl,
    absoluteUrl,
    title,
    description,
}: {
    resolvedUrl: string;
    absoluteUrl: string;
    title: string;
    description: string;
}) {
    const [useAltViewer, setUseAltViewer] = useState(false);
    const unavailable = useAvailabilityProbe(resolvedUrl);

    const embedSrc = useAltViewer
        ? `https://docs.google.com/gview?url=${encodeURIComponent(absoluteUrl)}&embedded=true`
        : `${resolvedUrl}#toolbar=1&view=FitH`;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-start sm:justify-between gap-3">
                <div className="min-w-0">
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="text-sm text-default-500 mt-1">{description}</p>
                </div>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto">
                    <Button
                        as={Link}
                        href={resolvedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="flat"
                        color="primary"
                        radius="lg"
                        className="w-full sm:w-auto"
                        startContent={
                            <Icon icon="material-symbols:picture-as-pdf" width={20} />
                        }
                    >
                        Abrir PDF
                    </Button>
                    <Button
                        as="a"
                        href={resolvedUrl}
                        download
                        variant="bordered"
                        radius="lg"
                        className="w-full sm:w-auto"
                        startContent={
                            <Icon icon="material-symbols:download" width={20} />
                        }
                    >
                        Descargar
                    </Button>
                    <Button
                        variant="light"
                        radius="lg"
                        className="col-span-2 sm:col-span-1 w-full sm:w-auto"
                        onPress={() => setUseAltViewer((value) => !value)}
                    >
                        {useAltViewer ? "Vista nativa" : "Vista alternativa"}
                    </Button>
                </div>
            </div>

            {unavailable ? (
                <Card shadow="none" className="border border-danger/20 bg-danger/5">
                    <CardBody className="p-4">
                        <p className="text-sm text-default-700">
                            El archivo no está disponible en el servidor (404). Verifica
                            que el backend esté corriendo y que el archivo exista en
                            uploads.
                        </p>
                    </CardBody>
                </Card>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-default-200 bg-default-50 shadow-soft">
                    <iframe
                        key={embedSrc}
                        src={embedSrc}
                        title={title}
                        className="h-[min(55vh,28rem)] sm:h-[min(70vh,42rem)] w-full bg-white"
                    />
                </div>
            )}
        </div>
    );
}

export default function ContractPdfViewer({
    pdfUrl,
    title = "Contrato del músico",
    description = "Lee el documento completo antes de aceptar los términos.",
    isLoading = false,
}: Props) {
    const resolvedUrl = resolveUploadUrl(pdfUrl);
    const absoluteUrl = toAbsoluteUploadUrl(pdfUrl);

    if (isLoading) {
        return (
            <div className="h-96 rounded-2xl border border-default-200 bg-default-100 animate-pulse" />
        );
    }

    if (!resolvedUrl || !absoluteUrl) {
        return (
            <Card shadow="none" className="border border-warning/30 bg-warning/5">
                <CardBody className="gap-3 p-5">
                    <div className="flex items-start gap-3">
                        <Icon
                            icon="material-symbols:warning"
                            width={22}
                            className="text-warning shrink-0 mt-0.5"
                        />
                        <div>
                            <p className="font-semibold text-foreground">
                                No se pudo cargar el contrato
                            </p>
                            <p className="text-sm text-default-600 mt-1">
                                El PDF aún no está disponible o no se pudo obtener la URL.
                                Recarga la página e inténtalo de nuevo.
                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <ContractPdfViewerLoaded
            key={resolvedUrl}
            resolvedUrl={resolvedUrl}
            absoluteUrl={absoluteUrl}
            title={title}
            description={description}
        />
    );
}

function isImageEvidence(url: string): boolean {
    return /\.(jpe?g|png|webp|gif)(\?|$)/i.test(url);
}

function PaymentEvidenceViewerLoaded({
    resolvedUrl,
    absoluteUrl,
    label,
}: {
    resolvedUrl: string;
    absoluteUrl: string | null;
    label: string;
}) {
    const [imageFailed, setImageFailed] = useState(false);
    const [useAltViewer, setUseAltViewer] = useState(false);
    const unavailable = useAvailabilityProbe(resolvedUrl);

    const asImage = isImageEvidence(resolvedUrl) && !imageFailed;
    const embedSrc =
        useAltViewer && absoluteUrl
            ? `https://docs.google.com/gview?url=${encodeURIComponent(absoluteUrl)}&embedded=true`
            : `${resolvedUrl}#toolbar=1`;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-foreground">{label}</p>
                <div className="flex flex-wrap gap-2">
                    <Button
                        as={Link}
                        href={resolvedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        variant="bordered"
                        radius="lg"
                        startContent={
                            <Icon icon="material-symbols:open-in-new" width={18} />
                        }
                    >
                        Abrir
                    </Button>
                    <Button
                        as="a"
                        href={resolvedUrl}
                        download
                        size="sm"
                        variant="flat"
                        radius="lg"
                        startContent={
                            <Icon icon="material-symbols:download" width={18} />
                        }
                    >
                        Descargar
                    </Button>
                    {!asImage ? (
                        <Button
                            size="sm"
                            variant="light"
                            radius="lg"
                            onPress={() => setUseAltViewer((value) => !value)}
                        >
                            {useAltViewer ? "Vista nativa" : "Vista alternativa"}
                        </Button>
                    ) : null}
                </div>
            </div>

            {unavailable ? (
                <Card shadow="none" className="border border-danger/20 bg-danger/5">
                    <CardBody className="p-4">
                        <p className="text-sm text-default-700">
                            El adjunto no está disponible en el servidor (404). Verifica
                            que el archivo exista en uploads.
                        </p>
                    </CardBody>
                </Card>
            ) : asImage ? (
                <div className="overflow-hidden rounded-2xl border border-default-200 bg-default-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={resolvedUrl}
                        alt={label}
                        className="max-h-96 w-full object-contain bg-white"
                        onError={() => setImageFailed(true)}
                    />
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-default-200 bg-default-50">
                    <iframe
                        key={embedSrc}
                        src={embedSrc}
                        title={label}
                        className="h-96 w-full bg-white"
                    />
                </div>
            )}
        </div>
    );
}

export function PaymentEvidenceViewer({
    evidenceUrl,
    evidenceUrls,
    label = "Comprobante de pago",
}: {
    evidenceUrl?: string | null;
    evidenceUrls?: string[] | null;
    label?: string;
}) {
    const urls: string[] = [];
    for (const item of evidenceUrls || []) {
        if (item && !urls.includes(item)) urls.push(item);
    }
    if (evidenceUrl && !urls.includes(evidenceUrl)) {
        urls.unshift(evidenceUrl);
    }

    if (urls.length === 0) {
        return (
            <p className="text-sm text-default-500">No hay comprobante disponible.</p>
        );
    }

    if (urls.length === 1) {
        const resolvedUrl = resolveUploadUrl(urls[0]);
        const absoluteUrl = toAbsoluteUploadUrl(urls[0]);
        if (!resolvedUrl) {
            return (
                <p className="text-sm text-default-500">No hay comprobante disponible.</p>
            );
        }
        return (
            <PaymentEvidenceViewerLoaded
                key={resolvedUrl}
                resolvedUrl={resolvedUrl}
                absoluteUrl={absoluteUrl}
                label={label}
            />
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {urls.map((url, index) => {
                const resolvedUrl = resolveUploadUrl(url);
                const absoluteUrl = toAbsoluteUploadUrl(url);
                if (!resolvedUrl) return null;
                return (
                    <PaymentEvidenceViewerLoaded
                        key={`${resolvedUrl}-${index}`}
                        resolvedUrl={resolvedUrl}
                        absoluteUrl={absoluteUrl}
                        label={`${label} · ${index + 1}`}
                    />
                );
            })}
        </div>
    );
}
