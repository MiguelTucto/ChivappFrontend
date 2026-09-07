import type { ValidationStepOut } from "@/types/api";

export type ContractorWizardStepKey = "personal" | "documents";

export type ContractorWizardStepDef = {
    key: ContractorWizardStepKey;
    title: string;
    description: string;
    icon: string;
    shortTitle?: string;
    required?: boolean;
};

export const CONTRACTOR_WIZARD_STEPS: ContractorWizardStepDef[] = [
    {
        key: "personal",
        title: "Datos personales",
        shortTitle: "Datos",
        description: "Completa tu identificación y datos de contacto para validar tu cuenta.",
        icon: "material-symbols:person",
        required: true,
    },
    {
        key: "documents",
        title: "Documento de identidad",
        shortTitle: "DNI",
        description: "Sube una foto clara de tu DNI, CE o pasaporte.",
        icon: "material-symbols:badge",
        required: true,
    },
];

export function getInitialStepIndex(validationSteps: ValidationStepOut[]): number {
    const firstIncomplete = CONTRACTOR_WIZARD_STEPS.findIndex((step) => {
        const match = validationSteps.find((item) => item.key === step.key);
        return !match?.completed;
    });
    return firstIncomplete === -1 ? 0 : firstIncomplete;
}
