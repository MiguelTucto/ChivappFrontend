import type { Metadata } from "next";
import ContractorLayoutClient from "./contractor-layout-client";

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function ContractorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ContractorLayoutClient>{children}</ContractorLayoutClient>;
}
