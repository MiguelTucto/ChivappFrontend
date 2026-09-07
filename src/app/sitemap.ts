import type { MetadataRoute } from "next";
import { getMusicians } from "@/lib/musicians";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: absoluteUrl("/"),
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
    ];

    let musicianRoutes: MetadataRoute.Sitemap = [];
    try {
        const musicians = await getMusicians({ limit: 200 });
        musicianRoutes = musicians.map((musician) => ({
            url: absoluteUrl(`/musicians/${musician.slug || musician.id}`),
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));
    } catch {
        // Sitemap still ships static routes if the API is unreachable at build time.
    }

    return [...staticRoutes, ...musicianRoutes];
}
