import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import {
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_TAGLINE,
    getSiteUrl,
    websiteJsonLd,
} from "@/lib/seo";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(getSiteUrl()),
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords: [
        "músicos",
        "contratar músicos",
        "música para eventos",
        "mariachi",
        "banda para fiesta",
        "músico para boda",
        "ChivApp",
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: "/",
    },
    icons: {
        icon: [
            { url: "/ico_chivapp.png" },
            { url: "/ico_chivapp.png", sizes: "32x32", type: "image/png" },
            { url: "/ico_chivapp.png", sizes: "192x192", type: "image/png" },
            { url: "/ico_chivapp.png", sizes: "512x512", type: "image/png" },
        ],
        shortcut: "/ico_chivapp.png",
        apple: [
            { url: "/ico_chivapp.png", sizes: "180x180", type: "image/png" },
        ],
    },
    manifest: "/manifest.json",
    openGraph: {
        type: "website",
        locale: "es_ES",
        siteName: SITE_NAME,
        title: SITE_NAME,
        description: SITE_TAGLINE,
        url: "/",
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_NAME,
        description: SITE_TAGLINE,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const jsonLd = websiteJsonLd();

    return (
        <html
            lang="es"
            suppressHydrationWarning
            data-scroll-behavior="smooth"
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <body className="min-h-screen flex flex-col bg-background text-foreground">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd),
                    }}
                />
                <Providers>
                    <main className="flex-1">{children}</main>
                </Providers>
            </body>
        </html>
    );
}
