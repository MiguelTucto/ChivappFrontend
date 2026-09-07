import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import {
    buildGoogleMapsUrl,
    buildOpenStreetMapUrl,
    parseLocationReference,
} from "@/lib/geocoding";

type Props = {
    address: string;
    city: string | null;
    reference: string | null;
};

export default function BookingLocationLinks({ address, city, reference }: Props) {
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

    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-default-200 bg-default-50/50 p-4 h-full">
            <div>
                <p className="text-sm text-default-500">Ubicación del evento</p>
                <p className="text-sm font-medium text-foreground mt-1">{address}</p>
                {city ? <p className="text-sm text-default-600 mt-0.5">{city}</p> : null}
            </div>

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
                                <Icon icon="material-symbols:map" width={18} height={18} />
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
                                <Icon icon="material-symbols:public" width={18} height={18} />
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
