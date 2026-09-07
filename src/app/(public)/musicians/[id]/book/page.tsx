import { redirect } from "next/navigation";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function BookMusicianPage({ params }: PageProps) {
    const { id } = await params;
    redirect(`/musicians/${id}?reservar=1`);
}
