import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { describe, expect, it } from "vitest";
import ThemeToggle from "./theme-toggle";

function renderWithTheme(defaultTheme: "light" | "dark" = "light") {
    return render(
        <ThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem={false}>
            <ThemeToggle />
        </ThemeProvider>,
    );
}

describe("ThemeToggle", () => {
    it("shows a button that offers to switch to dark mode when starting in light", async () => {
        renderWithTheme("light");
        const button = await screen.findByRole("button", {
            name: "Cambiar a modo oscuro",
        });
        expect(button).toBeInTheDocument();
    });

    it("toggles the aria-label after a click", async () => {
        const user = userEvent.setup();
        renderWithTheme("light");

        const button = await screen.findByRole("button", {
            name: "Cambiar a modo oscuro",
        });
        await user.click(button);

        expect(
            await screen.findByRole("button", { name: "Cambiar a modo claro" }),
        ).toBeInTheDocument();
    });
});
