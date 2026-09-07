import type { ProfileStatus, ProfileValidationOut } from "@/types/api";

export type ContractorFormState = {
    fullname?: string;
    username?: string;
    phone?: string;
    documentType: string;
    documentNumber: string;
    address: string;
    city: string;
    idDocumentUrl: string | null;
};

export function validateContractorForm(
    state: ContractorFormState,
    status: ProfileStatus,
    isPublic: boolean,
): ProfileValidationOut {
    const personalMissing: string[] = [];
    if (!state.fullname?.trim()) personalMissing.push("fullname");
    if (!state.documentType.trim()) personalMissing.push("document_type");
    if (!state.documentNumber.trim()) personalMissing.push("document_number");
    if (!state.address.trim()) personalMissing.push("address");
    if (!state.city.trim()) personalMissing.push("city");

    const documentsMissing: string[] = [];
    if (!state.idDocumentUrl) documentsMissing.push("id_document_url");

    const steps = [
        {
            id: 1,
            key: "personal",
            label: "Datos personales",
            completed: personalMissing.length === 0,
            missing: personalMissing,
            required: true,
        },
        {
            id: 2,
            key: "documents",
            label: "Documento de identidad",
            completed: documentsMissing.length === 0,
            missing: documentsMissing,
            required: true,
        },
    ];

    const currentStep = steps.find((step) => !step.completed)?.id ?? steps.length + 1;
    const canSubmit = steps.every((step) => step.completed);

    return {
        status,
        current_step: currentStep,
        steps,
        can_submit: canSubmit,
        is_public: isPublic,
    };
}
