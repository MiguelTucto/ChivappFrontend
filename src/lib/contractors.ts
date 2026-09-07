import { apiFetch } from "@/lib/api";
import type { ContractorProfilePublicOut } from "@/types/api";

export async function getContractorById(
    id: string,
): Promise<ContractorProfilePublicOut> {
    return apiFetch<ContractorProfilePublicOut>(`/profiles/contractors/${id}`);
}
