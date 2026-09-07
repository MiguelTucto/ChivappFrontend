import type { AvailabilityOut } from "@/types/api";

/** 0 = Domingo … 6 = Sábado (JS Date.getDay / musician wizard). */
export const AVAILABILITY_DAY_LABELS = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
] as const;

export function parseTimeToMinutes(value: string): number {
    const [hours, minutes] = value.slice(0, 5).split(":").map(Number);
    return hours * 60 + minutes;
}

export function formatTimeLabel(value: string): string {
    return value.slice(0, 5);
}

/** YYYY-MM-DD → day_of_week stored in availability. */
export function dateStringToDayOfWeek(dateStr: string): number {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day).getDay();
}

export function getAvailableDaySet(slots: AvailabilityOut[]): Set<number> {
    return new Set(slots.map((slot) => slot.day_of_week));
}

export function getSlotsForDate(
    slots: AvailabilityOut[],
    dateStr: string,
): AvailabilityOut[] {
    const dow = dateStringToDayOfWeek(dateStr);
    return slots.filter((slot) => slot.day_of_week === dow);
}

export function isDateAvailable(
    slots: AvailabilityOut[],
    dateStr: string,
): boolean {
    return getSlotsForDate(slots, dateStr).length > 0;
}

export function isTimeWithinSlots(
    slotsForDay: AvailabilityOut[],
    startTime: string,
): boolean {
    if (slotsForDay.length === 0) return false;
    const startMinutes = parseTimeToMinutes(startTime);
    return slotsForDay.some((slot) => {
        const from = parseTimeToMinutes(slot.start_time);
        const to = parseTimeToMinutes(slot.end_time);
        return startMinutes >= from && startMinutes < to;
    });
}

/** true si [aStart, aEnd) y [bStart, bEnd) se cruzan en algún punto. */
export function timeRangesOverlap(
    aStart: string,
    aEnd: string,
    bStart: string,
    bEnd: string,
): boolean {
    return (
        parseTimeToMinutes(aStart) < parseTimeToMinutes(bEnd) &&
        parseTimeToMinutes(bStart) < parseTimeToMinutes(aEnd)
    );
}

/**
 * Busca un horario existente que se cruce (mismo día + rango de horas
 * superpuesto, incluyendo duplicados exactos) con el horario propuesto.
 */
export function findOverlappingSlot(
    slots: AvailabilityOut[],
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    excludeId?: string,
): AvailabilityOut | undefined {
    return slots.find(
        (slot) =>
            slot.id !== excludeId &&
            slot.day_of_week === dayOfWeek &&
            timeRangesOverlap(startTime, endTime, slot.start_time, slot.end_time),
    );
}

export function formatAvailabilitySummary(slots: AvailabilityOut[]): string {
    if (slots.length === 0) return "Sin horarios publicados";

    const byDay = new Map<number, string[]>();
    for (const slot of slots) {
        const windows = byDay.get(slot.day_of_week) ?? [];
        windows.push(
            `${formatTimeLabel(slot.start_time)}–${formatTimeLabel(slot.end_time)}`,
        );
        byDay.set(slot.day_of_week, windows);
    }

    return [...byDay.entries()]
        .sort(([a], [b]) => a - b)
        .map(
            ([day, windows]) =>
                `${AVAILABILITY_DAY_LABELS[day]} ${windows.join(", ")}`,
        )
        .join(" · ");
}

export function validateBookingAgainstAvailability(input: {
    eventDate: string;
    startTime: string;
    slots: AvailabilityOut[];
}): string | null {
    if (input.slots.length === 0) {
        return "Este músico aún no tiene horarios de disponibilidad.";
    }
    if (!input.eventDate) return null;

    const daySlots = getSlotsForDate(input.slots, input.eventDate);
    if (daySlots.length === 0) {
        const days = [...getAvailableDaySet(input.slots)]
            .sort((a, b) => a - b)
            .map((d) => AVAILABILITY_DAY_LABELS[d]);
        return `El músico no está disponible ese día. Días disponibles: ${days.join(", ")}.`;
    }

    if (!input.startTime) return null;
    if (!isTimeWithinSlots(daySlots, input.startTime)) {
        const windows = daySlots
            .map(
                (s) =>
                    `${formatTimeLabel(s.start_time)}–${formatTimeLabel(s.end_time)}`,
            )
            .join(", ");
        return `La hora debe estar dentro de la disponibilidad: ${windows}.`;
    }

    return null;
}
