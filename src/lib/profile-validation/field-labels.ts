/** Human-readable labels for profile validation missing-field keys. */
export const PROFILE_FIELD_LABELS: Record<string, string> = {
    username: "Nombre de usuario",
    fullname: "Nombre completo",
    stage_name: "Nombre artístico",
    bio: "Biografía (mín. 40 caracteres)",
    profile_image_url: "Foto de perfil",
    genres: "Géneros",
    instruments: "Instrumentos",
    availability_type: "Tipo de tarifa",
    location_city: "Ciudad",
    location_zone: "Zona",
    price: "Tarifa",
    songs: "Repertorio",
    media_images: "Fotos",
    videos: "Videos",
    social_links: "Redes sociales",
    availability: "Disponibilidad",
    id_document_url: "Documento de identidad",
    contract_template_body: "Plantilla de contrato",
    signature_image_url: "Firma digital del músico",
    document_type: "Tipo de documento",
    document_number: "Número de documento",
    address: "Dirección",
    city: "Ciudad",
};

export function labelProfileField(field: string): string {
    return PROFILE_FIELD_LABELS[field] ?? field;
}

export function collectMissingFieldLabels(
    steps: Array<{
        completed: boolean;
        missing: string[];
        label: string;
        required?: boolean;
    }>,
): string[] {
    const labels: string[] = [];
    for (const step of steps) {
        if (step.required === false) continue;
        if (step.completed) continue;
        if (step.missing.length === 0) {
            labels.push(step.label);
            continue;
        }
        for (const field of step.missing) {
            labels.push(labelProfileField(field));
        }
    }
    return labels;
}
