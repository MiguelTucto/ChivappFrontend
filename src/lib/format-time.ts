const UNITS: Array<{ limit: number; divisor: number; unit: Intl.RelativeTimeFormatUnit }> = [
    { limit: 60, divisor: 1, unit: "second" },
    { limit: 3600, divisor: 60, unit: "minute" },
    { limit: 86400, divisor: 3600, unit: "hour" },
    { limit: 2592000, divisor: 86400, unit: "day" },
    { limit: 31536000, divisor: 2592000, unit: "month" },
    { limit: Infinity, divisor: 31536000, unit: "year" },
];

const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

/** "hace 5 min", "hace 3 h", "hace 2 días"… a partir de un ISO string pasado. */
export function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "—";

    const seconds = (Date.now() - date.getTime()) / 1000;
    if (seconds < 30) return "hace instantes";

    for (const { limit, divisor, unit } of UNITS) {
        if (seconds < limit) {
            const value = Math.floor(seconds / divisor);
            return rtf.format(-value, unit);
        }
    }
    return "—";
}
