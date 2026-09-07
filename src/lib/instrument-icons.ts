const INSTRUMENT_ICON_MAP: Record<string, string> = {
    guitarra: "mdi:guitar-acoustic",
    "guitarra acustica": "mdi:guitar-acoustic",
    "guitarra electrica": "mdi:guitar-electric",
    voz: "mdi:microphone",
    canto: "mdi:microphone",
    "voz principal": "mdi:microphone",
    trompeta: "mdi:trumpet",
    violin: "mdi:violin",
    viola: "mdi:viola",
    chelo: "mdi:cello",
    violonchelo: "mdi:cello",
    guitarrón: "material-symbols:music-note",
    guitarron: "material-symbols:music-note",
    arpa: "mdi:harp",
    flauta: "mdi:flute",
    piano: "mdi:piano",
    bateria: "mdi:drum",
    percusion: "mdi:drum",
    acordeon: "mdi:accordion",
    saxofon: "mdi:saxophone",
    contrabajo: "mdi:counterbass",
    clarinete: "mdi:clarinet",
    bandoneon: "mdi:accordion",
    maracas: "mdi:drum",
    tambor: "mdi:drum",
    charango: "mdi:guitar-acoustic",
    quena: "mdi:flute",
    cajon: "mdi:drum",
    teclado: "mdi:piano",
    bajo: "mdi:guitar-electric",
    vihuela: "mdi:guitar-acoustic",
};

function normalizeInstrument(name: string): string {
    return name
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim();
}

/** Resolves an Iconify icon for a free-text instrument label from profile setup. */
export function getInstrumentIcon(name: string): string {
    const key = normalizeInstrument(name);

    if (INSTRUMENT_ICON_MAP[key]) {
        return INSTRUMENT_ICON_MAP[key];
    }

    for (const [label, icon] of Object.entries(INSTRUMENT_ICON_MAP)) {
        if (key.includes(label) || label.includes(key)) {
            return icon;
        }
    }

    return "material-symbols:music-note";
}

/** Known labels for quick-pick in profile configuration (future use). */
export const COMMON_INSTRUMENTS = [
    "Guitarra",
    "Voz",
    "Trompeta",
    "Violín",
    "Guitarrón",
    "Arpa",
    "Vihuela",
    "Flauta",
    "Percusión",
    "Piano",
] as const;
