"use client";

import { useEffect, useState } from "react";
import { Button, Image, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { getPlatformPaymentInstructions } from "@/lib/payments";
import { resolveUploadUrl } from "@/lib/uploads";
import type { PlatformPaymentInstructions } from "@/types/api";

type Props = {
    className?: string;
};

export default function PaymentInstructionsCard({ className = "" }: Props) {
    const [data, setData] = useState<PlatformPaymentInstructions | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        getPlatformPaymentInstructions()
            .then((row) => {
                if (!cancelled) setData(row);
            })
            .catch(() => {
                if (!cancelled) setData(null);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    async function copyPhone() {
        if (!data?.phone_number) return;
        try {
            await navigator.clipboard.writeText(data.phone_number);
            addToast({ title: "Número copiado", color: "success" });
        } catch {
            addToast({
                title: "No se pudo copiar",
                description: "Copia el número manualmente.",
                color: "warning",
            });
        }
    }

    if (isLoading) {
        return (
            <div
                className={`rounded-2xl border border-default-200 bg-default-100/80 h-36 animate-pulse ${className}`}
            />
        );
    }

    if (!data || (!data.phone_number && !data.qr_image_url)) {
        return (
            <div
                className={`rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-default-700 ${className}`}
            >
                La cuenta de pago de la plataforma aún no está configurada. Contacta a
                soporte antes de transferir.
            </div>
        );
    }

    const qrSrc = data.qr_image_url ? resolveUploadUrl(data.qr_image_url) : null;

    return (
        <div
            className={`rounded-2xl border border-primary/25 bg-primary/5 p-4 sm:p-5 ${className}`}
        >
            <div className="flex items-start gap-2 mb-3">
                <Icon
                    icon="material-symbols:qr-code-2"
                    width={22}
                    className="text-primary shrink-0 mt-0.5"
                />
                <div>
                    <p className="font-semibold text-foreground">
                        Paga a la cuenta de ChivApp
                    </p>
                    <p className="text-sm text-default-600 mt-0.5">
                        {data.instructions ||
                            "Escanea el QR o copia el número. El dinero queda retenido en la plataforma hasta liquidar el show."}
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                {qrSrc ? (
                    <div className="rounded-xl border border-default-200 bg-content1 p-2 shrink-0">
                        <Image
                            src={qrSrc}
                            alt="QR de pago ChivApp"
                            className="object-contain"
                            classNames={{ wrapper: "w-36 h-36", img: "w-36 h-36" }}
                        />
                    </div>
                ) : null}

                <div className="flex-1 w-full flex flex-col gap-3">
                    {data.account_name ? (
                        <p className="text-sm text-default-600">
                            Titular:{" "}
                            <span className="font-semibold text-foreground">
                                {data.account_name}
                            </span>
                        </p>
                    ) : null}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex-1 rounded-xl border border-default-200 bg-content1 px-3 py-2">
                            <p className="text-xs text-default-500">
                                {data.phone_label || "Yape / Plin"}
                            </p>
                            <p className="text-lg font-bold tracking-wide text-foreground">
                                {data.phone_number}
                            </p>
                        </div>
                        <Button
                            color="primary"
                            radius="lg"
                            className="font-semibold shrink-0"
                            onPress={copyPhone}
                            startContent={
                                <Icon icon="material-symbols:content-copy" width={18} />
                            }
                        >
                            Copiar número
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
