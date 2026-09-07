"use client";

import dynamic from "next/dynamic";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import {
    buildGoogleMapsUrl,
    buildOpenStreetMapUrl,
    parseLocationReference,
} from "@/lib/geocoding";

type Props = {
    address: string | null | undefined;
    city: string | null | undefined;
    reference: string | null | undefined;
    className?: string;
};

const LocationMapPreviewInner = dynamic(
    () => import("@/components/ui/location-map-preview-inner"),
    {
        ssr: false,
        loading: () => (
            <div className="h-52 rounded-2xl border border-default-200 bg-default-100 animate-pulse" />
        ),
    },
);

export default function LocationMapPreview({
    address,
    city,
    reference,
    className,
}: Props) {
    const coords = parseLocationReference(reference);
    const googleMapsUrl = buildGoogleMapsUrl({
        lat: coords?.lat,
        lng: coords?.lng,
        address,
        city,
    });
    const openStreetMapUrl = coords
        ? buildOpenStreetMapUrl(coords.lat, coords.lng)
        : null;
    const placeLine = [address, city].filter(Boolean).join(" · ");

    return (
        <div className={`flex flex-col gap-3 ${className ?? ""}`}>
            {coords ? (
                <LocationMapPreviewInner lat={coords.lat} lng={coords.lng} />
            ) : (
                <div className="h-52 rounded-2xl border border-dashed border-default-300 bg-default-50 flex items-center justify-center px-4 text-center">
                    <p className="text-sm text-default-500">
                        No hay coordenadas para mostrar el mapa. Usa los enlaces
                        con la dirección.
                    </p>
                </div>
            )}

            {placeLine ? (
                <p className="text-sm text-foreground">{placeLine}</p>
            ) : null}

            {(googleMapsUrl || openStreetMapUrl) && (
                <div className="flex flex-wrap gap-2">
                    {googleMapsUrl ? (
                        <Button
                            as="a"
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            color="primary"
                            variant="flat"
                            radius="lg"
                            startContent={
                                <Icon icon="material-symbols:map" width={18} />
                            }
                        >
                            Abrir en Google Maps
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
                            startContent={
                                <Icon icon="material-symbols:public" width={18} />
                            }
                        >
                            Abrir en OpenStreetMap
                        </Button>
                    ) : null}
                </div>
            )}
        </div>
    );
}
