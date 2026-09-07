import { describe, expect, it } from "vitest";

const SMOKE_BASE_URL = process.env.SMOKE_BASE_URL;

describe.skipIf(!SMOKE_BASE_URL)("sitio desplegado", () => {
    it("la home responde 200", async () => {
        const response = await fetch(`${SMOKE_BASE_URL}/`);
        expect(response.status).toBe(200);
    });

    it("el sitemap responde 200 con XML válido", async () => {
        const response = await fetch(`${SMOKE_BASE_URL}/sitemap.xml`);
        expect(response.status).toBe(200);
        const body = await response.text();
        expect(body).toContain("<urlset");
    });
});
