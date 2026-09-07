import type { BookingOut } from "@/types/api";

/** Comisión de plataforma sobre el precio del músico (solo la paga el contratista). */

export function platformFeeAmount(booking: Pick<
    BookingOut,
    "platform_fee_amount" | "price_agreed" | "platform_fee_percent"
>): number {
    if (booking.platform_fee_amount != null) {
        return Math.max(0, Number(booking.platform_fee_amount));
    }
    const price = booking.price_agreed != null ? Number(booking.price_agreed) : 0;
    const percent =
        booking.platform_fee_percent != null
            ? Number(booking.platform_fee_percent)
            : 0;
    if (price <= 0 || percent <= 0) return 0;
    return Math.round(price * percent) / 100;
}

export function contractorPayableTotal(booking: Pick<
    BookingOut,
    "price_agreed" | "platform_fee_amount" | "platform_fee_percent"
>): number | null {
    if (booking.price_agreed == null) return null;
    return Number(booking.price_agreed) + platformFeeAmount(booking);
}

/**
 * Anticipo a transferir: el anticipo del servicio.
 * La comisión de plataforma se liquida en el saldo restante.
 *
 * Ejemplo: precio 500, comisión 2% = 10, anticipo 200 → anticipo a transferir = 200.
 */
export function contractorAdvanceDue(booking: Pick<
    BookingOut,
    | "price_agreed"
    | "advance_amount"
    | "platform_fee_amount"
    | "platform_fee_percent"
>): number | null {
    const total = contractorPayableTotal(booking);
    if (total == null) return null;
    if (booking.advance_amount == null) return total;
    return Number(booking.advance_amount);
}

/**
 * Saldo estimado tras el anticipo: (precio + comisión) − anticipo.
 *
 * Ejemplo: 500 + 10 − 200 = 310.
 */
export function contractorRemainingAfterAdvance(booking: Pick<
    BookingOut,
    | "price_agreed"
    | "advance_amount"
    | "platform_fee_amount"
    | "platform_fee_percent"
>): number | null {
    const total = contractorPayableTotal(booking);
    if (total == null) return null;
    const advance =
        booking.advance_amount != null ? Number(booking.advance_amount) : 0;
    return Math.max(0, Math.round((total - advance) * 100) / 100);
}
