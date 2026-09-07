import { Suspense } from "react";
import BookingDetailView from "@/components/booking/booking-detail-view";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function MusicianBookingDetailPage({ params }: PageProps) {
    const { id } = await params;
    return (
        <Suspense fallback={<div className="p-8 text-center text-default-500">Cargando reserva...</div>}>
            <BookingDetailView bookingId={id} role="musician" />
        </Suspense>
    );
}
