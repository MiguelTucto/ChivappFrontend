import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MusicianCardComponent from "./musician-card";
import type { MusicianCard } from "@/types/ui/musician";

function baseMusician(overrides: Partial<MusicianCard> = {}): MusicianCard {
    return {
        id: "musician-1",
        slug: "mariachi-de-prueba",
        name: "Mariachi de Prueba",
        genre: "Ranchera",
        genres: ["Ranchera"],
        instruments: ["Trompeta"],
        bio: "Un mariachi de prueba.",
        city: "Lima",
        zone: "Miraflores",
        price: 500,
        priceLabel: "Desde S/ 500/evento",
        image: null,
        images: [],
        rating: null,
        ratingCount: null,
        verified: false,
        ...overrides,
    };
}

describe("MusicianCardComponent", () => {
    it("renders the musician's name, genre and location", () => {
        render(<MusicianCardComponent musician={baseMusician()} />);
        expect(screen.getByText("Mariachi de Prueba")).toBeInTheDocument();
        expect(screen.getByText("Ranchera · S/ 500")).toBeInTheDocument();
        expect(screen.getByText("Lima · Miraflores")).toBeInTheDocument();
    });

    it("links to the musician's slug when available", () => {
        render(<MusicianCardComponent musician={baseMusician()} />);
        expect(screen.getByRole("link")).toHaveAttribute(
            "href",
            "/musicians/mariachi-de-prueba",
        );
    });

    it("falls back to the id in the link when there is no slug", () => {
        render(<MusicianCardComponent musician={baseMusician({ slug: null })} />);
        expect(screen.getByRole("link")).toHaveAttribute(
            "href",
            "/musicians/musician-1",
        );
    });

    it("shows a fallback image when the musician has no photos", () => {
        render(<MusicianCardComponent musician={baseMusician({ image: null, images: [] })} />);
        const image = screen.getByAltText(/Mariachi de Prueba/);
        expect(image).toHaveAttribute(
            "src",
            expect.stringContaining("pexels-photo-1105666"),
        );
    });
});
