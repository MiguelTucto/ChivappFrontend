"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import VideoPlaybackModal from "@/components/ui/video-playback-modal";
import { useVideoPlayback } from "@/hooks/use-video-playback";
import { getYoutubeVideoId, normalizeUrl } from "@/lib/video-urls";
import type { RepertoireItem } from "@/types/api";

type Props = {
    label?: string;
    values: RepertoireItem[];
    onChange: (values: RepertoireItem[]) => void;
};

export default function RepertoireListInput({
    label = "Canciones que interpretas",
    values,
    onChange,
}: Props) {
    const [title, setTitle] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [error, setError] = useState<string | null>(null);
    const videoPlayback = useVideoPlayback();

    function addItem() {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            setError("Escribe el nombre de la canción.");
            return;
        }

        const normalizedYoutube = youtubeUrl.trim()
            ? normalizeUrl(youtubeUrl.trim())
            : null;
        if (normalizedYoutube && !getYoutubeVideoId(normalizedYoutube)) {
            setError("El enlace de YouTube no es válido.");
            return;
        }

        const exists = values.some(
            (item) => item.title.toLowerCase() === trimmedTitle.toLowerCase(),
        );
        if (exists) {
            setError("Esa canción ya está en tu repertorio.");
            return;
        }

        onChange([
            ...values,
            {
                title: trimmedTitle,
                youtube_url: normalizedYoutube,
            },
        ]);
        setTitle("");
        setYoutubeUrl("");
        setError(null);
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-default-500 mt-1">
                        Agrega el título y, si quieres, un enlace de YouTube de la
                        canción.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.2fr_auto] gap-2">
                    <Input
                        label="Canción"
                        value={title}
                        onValueChange={(value) => {
                            setTitle(value);
                            setError(null);
                        }}
                        placeholder="Ej. La Bikina"
                        variant="bordered"
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                addItem();
                            }
                        }}
                    />
                    <Input
                        label="YouTube (opcional)"
                        value={youtubeUrl}
                        onValueChange={(value) => {
                            setYoutubeUrl(value);
                            setError(null);
                        }}
                        placeholder="https://youtube.com/watch?v=..."
                        variant="bordered"
                        startContent={
                            <Icon
                                icon="mdi:youtube"
                                width={18}
                                className="text-danger"
                            />
                        }
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                addItem();
                            }
                        }}
                    />
                    <Button
                        radius="lg"
                        color="primary"
                        variant="flat"
                        className="sm:self-end h-14"
                        onPress={addItem}
                        startContent={
                            <Icon icon="material-symbols:add" width={18} />
                        }
                    >
                        Agregar
                    </Button>
                </div>

                {error ? <p className="text-xs text-danger">{error}</p> : null}

                {values.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-default-300 bg-default-50 px-4 py-8 text-center">
                        <Icon
                            icon="material-symbols:library-music"
                            width={28}
                            className="mx-auto text-default-400 mb-2"
                        />
                        <p className="text-sm text-default-500">
                            Aún no agregaste canciones a tu repertorio.
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-default-200/80 rounded-2xl border border-default-200/70 overflow-hidden">
                        {values.map((item, index) => (
                            <li
                                key={`${item.title}-${index}`}
                                className="flex items-center gap-3 px-4 py-3 bg-content1"
                            >
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-default-100 text-xs font-bold text-default-600 tabular-nums">
                                    {index + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {item.title}
                                    </p>
                                    {item.youtube_url ? (
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1 text-xs text-danger hover:underline mt-0.5"
                                            onClick={() =>
                                                videoPlayback.openVideo(
                                                    item.youtube_url!,
                                                    item.title,
                                                )
                                            }
                                        >
                                            <Icon icon="mdi:youtube" width={14} />
                                            Ver en YouTube
                                        </button>
                                    ) : (
                                        <p className="text-xs text-default-400 mt-0.5">
                                            Sin enlace de YouTube
                                        </p>
                                    )}
                                </div>
                                {item.youtube_url ? (
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="flat"
                                        radius="lg"
                                        aria-label={`Abrir ${item.title} en YouTube`}
                                        className="shrink-0 text-danger"
                                        onPress={() =>
                                            videoPlayback.openVideo(
                                                item.youtube_url!,
                                                item.title,
                                            )
                                        }
                                    >
                                        <Icon icon="mdi:youtube" width={18} />
                                    </Button>
                                ) : null}
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    radius="lg"
                                    aria-label={`Quitar ${item.title}`}
                                    onPress={() =>
                                        onChange(
                                            values.filter((_, i) => i !== index),
                                        )
                                    }
                                >
                                    <Icon
                                        icon="material-symbols:close"
                                        width={18}
                                        className="text-default-500"
                                    />
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <VideoPlaybackModal
                isOpen={videoPlayback.isOpen}
                onOpenChange={videoPlayback.onOpenChange}
                url={videoPlayback.url}
                title={videoPlayback.title}
            />
        </>
    );
}
