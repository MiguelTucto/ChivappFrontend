import type { Metadata } from "next";
import GuestShareView from "@/components/booking/guest-share-view";
import { getPublicShare } from "@/lib/booking-share";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
    params: Promise<{ token: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { token } = await params;

    try {
        const share = await getPublicShare(token);
        const where = share.location_city ? ` en ${share.location_city}` : "";
        const who = share.musician_name ? ` con ${share.musician_name}` : "";
        const title = `${share.event_type}${where}`;
        const description =
            share.message?.trim() ||
            `Revive el evento${who} y deja tu reacción en Chivapp.`;

        return buildPageMetadata({
            title,
            description,
            path: `/share/${token}`,
            noIndex: true,
        });
    } catch {
        return buildPageMetadata({
            title: "Evento compartido",
            description: "Mira este evento y deja tu reacción en Chivapp.",
            path: `/share/${token}`,
            noIndex: true,
        });
    }
}

export default async function SharePage({ params }: Props) {
    const { token } = await params;
    return <GuestShareView token={token} />;
}
