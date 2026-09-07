import type { Metadata } from "next";
import MusicianLayoutClient from "./musician-layout-client";

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function MusicianLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <MusicianLayoutClient>{children}</MusicianLayoutClient>;
}
