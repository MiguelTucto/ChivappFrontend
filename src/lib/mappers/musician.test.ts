import { describe, expect, it } from "vitest";
import {
    toMusicianCardFromList,
    toMusicianCardFromSearch,
    toMusicianDetailFromOwnedProfile,
} from "./musician";
import type { MusicianProfileListOut, MusicianProfileOut, MusicianSearchResult } from "@/types/api";

function baseListProfile(
    overrides: Partial<MusicianProfileListOut> = {},
): MusicianProfileListOut {
    return {
        id: "musician-1",
        stage_name: "Mariachi de Prueba",
        slug: "mariachi-de-prueba",
        bio: null,
        genres: [],
        instruments: [],
        songs: [],
        price_per_hour: null,
        price_per_event: null,
        availability_type: "both",
        location_city: null,
        location_zone: null,
        rating_avg: null,
        rating_count: null,
        profile_image_url: null,
        gallery_images: [],
        videos: [],
        is_verified: false,
        ...overrides,
    };
}

describe("toMusicianCardFromList", () => {
    it("uses the slug for the card, not the id", () => {
        const card = toMusicianCardFromList(baseListProfile());
        expect(card.slug).toBe("mariachi-de-prueba");
        expect(card.id).toBe("musician-1");
    });

    it("falls back to null image and empty images when there is no photo", () => {
        const card = toMusicianCardFromList(baseListProfile());
        expect(card.image).toBeNull();
        expect(card.images).toEqual([]);
    });

    it("resolves upload paths into the image list", () => {
        const card = toMusicianCardFromList(
            baseListProfile({
                profile_image_url: "/uploads/profile.jpg",
                gallery_images: ["/uploads/1.jpg", "/uploads/2.jpg"],
            }),
        );
        expect(card.image).toBe("/uploads/profile.jpg");
        expect(card.images).toEqual([
            "/uploads/profile.jpg",
            "/uploads/1.jpg",
            "/uploads/2.jpg",
        ]);
    });

    it("falls back to 'Sin género' when there are no genres", () => {
        const card = toMusicianCardFromList(baseListProfile({ genres: [] }));
        expect(card.genre).toBe("Sin género");
    });

    it("uses the first genre when present", () => {
        const card = toMusicianCardFromList(
            baseListProfile({ genres: ["Ranchera", "Bolero"] }),
        );
        expect(card.genre).toBe("Ranchera");
    });

    it("formats a price label for hourly + per-event availability", () => {
        const card = toMusicianCardFromList(
            baseListProfile({
                availability_type: "both",
                price_per_hour: 150,
                price_per_event: 900,
            }),
        );
        expect(card.priceLabel).toBe("S/ 150/h · S/ 900/evento");
    });

    it("shows only the per-event price when availability is per_event", () => {
        const card = toMusicianCardFromList(
            baseListProfile({
                availability_type: "per_event",
                price_per_hour: 150,
                price_per_event: 900,
            }),
        );
        expect(card.priceLabel).toBe("Desde S/ 900/evento");
    });

    it("falls back to 'Consultar tarifa' when there is no price", () => {
        const card = toMusicianCardFromList(baseListProfile());
        expect(card.priceLabel).toBe("Consultar tarifa");
    });
});

describe("toMusicianCardFromSearch", () => {
    function baseSearchResult(
        overrides: Partial<MusicianSearchResult> = {},
    ): MusicianSearchResult {
        return {
            musician_id: "musician-2",
            stage_name: "Mariachi Búsqueda",
            genres: [],
            instruments: [],
            city: null,
            zone: null,
            price_per_event: null,
            main_image_url: null,
            rating_avg: null,
            rating_count: null,
            is_verified: false,
            ...overrides,
        } as MusicianSearchResult;
    }

    it("never has a slug (search results don't carry one)", () => {
        const card = toMusicianCardFromSearch(baseSearchResult());
        expect(card.slug).toBeNull();
    });

    it("prices from search results are always per-event", () => {
        const card = toMusicianCardFromSearch(
            baseSearchResult({ price_per_event: 500 }),
        );
        expect(card.priceLabel).toBe("Desde S/ 500/evento");
    });
});

describe("toMusicianDetailFromOwnedProfile", () => {
    function ownedProfile(overrides: Partial<MusicianProfileOut> = {}): MusicianProfileOut {
        return {
            id: "musician-3",
            user_id: "user-3",
            stage_name: "Mariachi Dueño",
            slug: "mariachi-dueno",
            bio: null,
            genres: [],
            instruments: [],
            songs: [],
            repertoire: [],
            price_per_hour: null,
            price_per_event: null,
            availability_type: "both",
            location_city: null,
            location_zone: null,
            rating_avg: null,
            rating_count: null,
            profile_image_url: "/uploads/owned.jpg",
            gallery_images: [],
            videos: [],
            is_verified: false,
            status: "published",
            ...overrides,
        } as MusicianProfileOut;
    }

    it("merges media-gallery urls with the profile's own gallery, deduped", () => {
        const detail = toMusicianDetailFromOwnedProfile(
            ownedProfile({ gallery_images: ["/uploads/owned.jpg", "/uploads/2.jpg"] }),
            ["/uploads/2.jpg", "/uploads/3.jpg"],
        );
        expect(detail.galleryImages).toEqual([
            "/uploads/2.jpg",
            "/uploads/3.jpg",
            "/uploads/owned.jpg",
        ]);
    });

    it("derives is_verified from a published status", () => {
        const published = toMusicianDetailFromOwnedProfile(ownedProfile({ status: "published" }));
        const draft = toMusicianDetailFromOwnedProfile(ownedProfile({ status: "draft" }));
        expect(published.verified).toBe(true);
        expect(draft.verified).toBe(false);
    });
});
