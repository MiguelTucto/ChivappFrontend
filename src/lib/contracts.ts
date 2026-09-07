import { ApiError, apiFetch } from "@/lib/api";
import type { ContractOut } from "@/types/api";

function getApiUrl(): string {
    if (typeof window !== "undefined") {
        return process.env.NEXT_PUBLIC_API_URL || "/api/v1";
    }
    return (
        process.env.API_URL_INTERNAL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:8000/api/v1"
    );
}

export function getBookingContract(bookingId: string) {
    return apiFetch<ContractOut>(`/contracts/booking/${bookingId}`);
}

export function getContract(contractId: string) {
    return apiFetch<ContractOut>(`/contracts/${contractId}`);
}

/** PDF generado on-demand desde el snapshot (o legacy). Requiere sesión. */
export async function getBookingContractPdfBlob(bookingId: string): Promise<Blob> {
    const endpoint = `/contracts/booking/${bookingId}/pdf`;
    let res: Response;
    try {
        res = await fetch(`${getApiUrl()}${endpoint}`, {
            method: "GET",
            credentials: "include",
        });
    } catch {
        throw new ApiError(
            endpoint,
            0,
            "No se pudo conectar con el servidor. Verifica que la aplicación esté en ejecución.",
        );
    }

    if (!res.ok) {
        let message = `Error ${res.status}`;
        try {
            const body = await res.json();
            if (typeof body.detail === "string") message = body.detail;
        } catch {
            // ignore
        }
        throw new ApiError(endpoint, res.status, message);
    }

    return res.blob();
}
