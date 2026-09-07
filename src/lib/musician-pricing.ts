import type { AvailabilityType } from "@/types/api";

export type VisibleMusicianPrices = {
    pricePerHour: number | null;
    pricePerEvent: number | null;
    showHourly: boolean;
    showPerEvent: boolean;
};

/** Which price fields should be shown based on the musician's availability type. */
export function getVisibleMusicianPrices(
    availabilityType: AvailabilityType | null | undefined,
    pricePerHour: number | null | undefined,
    pricePerEvent: number | null | undefined,
): VisibleMusicianPrices {
    const type = availabilityType ?? "both";
    const showHourly = type === "hourly" || type === "both";
    const showPerEvent = type === "per_event" || type === "both";

    return {
        showHourly,
        showPerEvent,
        pricePerHour: showHourly ? (pricePerHour ?? null) : null,
        pricePerEvent: showPerEvent ? (pricePerEvent ?? null) : null,
    };
}

export function resolveDisplayPrice(
    availabilityType: AvailabilityType | null | undefined,
    pricePerHour: number | null | undefined,
    pricePerEvent: number | null | undefined,
): number | null {
    const visible = getVisibleMusicianPrices(
        availabilityType,
        pricePerHour,
        pricePerEvent,
    );
    if (visible.pricePerHour != null) return visible.pricePerHour;
    if (visible.pricePerEvent != null) return visible.pricePerEvent;
    return null;
}
