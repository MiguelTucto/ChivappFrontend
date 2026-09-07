import { contractHtmlTextLength } from "@/lib/contract-templates";
import type {
    AvailabilityType,
    ProfileStatus,
    ProfileValidationOut,
    RepertoireItem,
} from "@/types/api";

export const MUSICIAN_REQUIRED_STEP_KEYS = [
    "identity",
    "specialty",
    "documents",
] as const;

export type MusicianFormState = {
    username?: string;
    fullname?: string;
    stageName: string;
    bio: string;
    genres: string[];
    instruments: string[];
    songs: string[];
    repertoire: RepertoireItem[];
    locationCity: string;
    locationZone: string;
    pricePerHour: string;
    pricePerEvent: string;
    availabilityType: AvailabilityType;
    profileImageUrl: string | null;
    videoUrls: string[];
    instagramUrl: string;
    facebookUrl: string;
    tiktokUrl: string;
    youtubeChannelUrl: string;
    spotifyUrl: string;
    websiteUrl: string;
    idDocumentUrl: string | null;
    contractBody: string;
    signatureImageUrl: string | null;
    mediaImageCount: number;
    availabilityCount: number;
};

function hasPrice(state: MusicianFormState): boolean {
    if (state.availabilityType === "hourly") {
        return state.pricePerHour.trim().length > 0;
    }
    if (state.availabilityType === "per_event") {
        return state.pricePerEvent.trim().length > 0;
    }
    return state.pricePerHour.trim().length > 0 || state.pricePerEvent.trim().length > 0;
}

function hasSocialLink(state: MusicianFormState): boolean {
    return [
        state.instagramUrl,
        state.facebookUrl,
        state.tiktokUrl,
        state.youtubeChannelUrl,
        state.spotifyUrl,
        state.websiteUrl,
    ].some((link) => link.trim().length > 0);
}

function isRequiredStep(key: string): boolean {
    return (MUSICIAN_REQUIRED_STEP_KEYS as readonly string[]).includes(key);
}

export function validateMusicianForm(
    state: MusicianFormState,
    status: ProfileStatus,
    isPublic: boolean,
): ProfileValidationOut {
    const identityMissing: string[] = [];
    if (state.username !== undefined && !state.username.trim()) {
        identityMissing.push("username");
    }
    if (state.fullname !== undefined && !state.fullname.trim()) {
        identityMissing.push("fullname");
    }
    if (!state.stageName.trim()) identityMissing.push("stage_name");
    if (state.bio.trim().length < 40) identityMissing.push("bio");
    if (!state.profileImageUrl && state.mediaImageCount === 0) {
        identityMissing.push("profile_image_url");
    }

    const specialtyMissing: string[] = [];
    if (state.genres.length === 0) specialtyMissing.push("genres");
    if (state.instruments.length === 0) specialtyMissing.push("instruments");
    if (!state.availabilityType) specialtyMissing.push("availability_type");

    const locationMissing: string[] = [];
    if (!state.locationCity.trim()) locationMissing.push("location_city");
    if (!state.locationZone.trim()) locationMissing.push("location_zone");
    if (!hasPrice(state)) locationMissing.push("price");

    const repertoireMissing: string[] = [];
    const repertoireCount =
        state.repertoire.filter((item) => item.title.trim().length > 0).length ||
        state.songs.length;
    if (repertoireCount === 0) repertoireMissing.push("songs");

    const videoUrls = state.videoUrls.filter((url) => url.trim().length > 0);
    const mediaMissing: string[] = [];
    if (state.mediaImageCount < 1 && !state.profileImageUrl) {
        mediaMissing.push("media_images");
    }
    if (videoUrls.length < 1) mediaMissing.push("videos");

    const socialMissing: string[] = [];
    if (!hasSocialLink(state)) socialMissing.push("social_links");

    const availabilityMissing: string[] = [];
    if (state.availabilityCount < 1) availabilityMissing.push("availability");

    const documentsMissing: string[] = [];
    if (!state.idDocumentUrl) documentsMissing.push("id_document_url");

    const contractMissing: string[] = [];
    if (contractHtmlTextLength(state.contractBody) < 50) {
        contractMissing.push("contract_template_body");
    }
    if (!state.signatureImageUrl) {
        contractMissing.push("signature_image_url");
    }

    const steps = [
        {
            id: 1,
            key: "identity",
            label: "Identidad artística",
            completed: identityMissing.length === 0,
            missing: identityMissing,
            required: true,
        },
        {
            id: 2,
            key: "specialty",
            label: "Especialidad",
            completed: specialtyMissing.length === 0,
            missing: specialtyMissing,
            required: true,
        },
        {
            id: 3,
            key: "location_pricing",
            label: "Ubicación y tarifas",
            completed: locationMissing.length === 0,
            missing: locationMissing,
            required: false,
        },
        {
            id: 4,
            key: "repertoire",
            label: "Repertorio",
            completed: repertoireMissing.length === 0,
            missing: repertoireMissing,
            required: false,
        },
        {
            id: 5,
            key: "media",
            label: "Fotos y videos",
            completed: mediaMissing.length === 0,
            missing: mediaMissing,
            required: false,
        },
        {
            id: 6,
            key: "social",
            label: "Redes sociales",
            completed: socialMissing.length === 0,
            missing: socialMissing,
            required: false,
        },
        {
            id: 7,
            key: "availability",
            label: "Disponibilidad",
            completed: availabilityMissing.length === 0,
            missing: availabilityMissing,
            required: false,
        },
        {
            id: 8,
            key: "documents",
            label: "Documento de identidad",
            completed: documentsMissing.length === 0,
            missing: documentsMissing,
            required: true,
        },
        {
            id: 9,
            key: "contract",
            label: "Plantilla y firma de contrato",
            completed: contractMissing.length === 0,
            missing: contractMissing,
            required: false,
        },
    ];

    const requiredIncomplete = steps.find(
        (step) => step.required && !step.completed,
    );
    const anyIncomplete = steps.find((step) => !step.completed);
    const currentStep =
        requiredIncomplete?.id ?? anyIncomplete?.id ?? steps.length + 1;
    const canSubmit = steps
        .filter((step) => isRequiredStep(step.key))
        .every((step) => step.completed);

    return {
        status,
        current_step: currentStep,
        steps,
        can_submit: canSubmit,
        is_public: isPublic,
    };
}
