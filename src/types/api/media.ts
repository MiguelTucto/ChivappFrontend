import type { MediaType } from "./enums";

export type MusicianMediaCreate = {
    type: MediaType;
    url: string;
    thumbnail_url?: string | null;
    order_index?: number;
};

export type MusicianMediaUpdate = Partial<MusicianMediaCreate>;

export type MusicianMediaOut = MusicianMediaCreate & {
    id: string;
    musician_id: string;
    created_at: string;
};
