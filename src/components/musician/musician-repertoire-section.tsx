"use client";

import { useMemo, useState } from "react";
import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import VideoPlaybackModal from "@/components/ui/video-playback-modal";
import { useVideoPlayback } from "@/hooks/use-video-playback";
import { UI } from "@/lib/ui-classes";
import type { MusicianRepertoireItem } from "@/types/ui/musician";

const INITIAL_VISIBLE = 10;

type Props = {
    songs?: string[];
    repertoire?: MusicianRepertoireItem[];
    className?: string;
};

function normalizeItems(
    repertoire?: MusicianRepertoireItem[],
    songs?: string[],
): MusicianRepertoireItem[] {
    if (repertoire?.length) return repertoire;
    return (songs ?? []).map((title) => ({ title, youtubeUrl: null }));
}

export default function MusicianRepertoireSection({
    songs,
    repertoire,
    className = "",
}: Props) {
    const items = useMemo(
        () => normalizeItems(repertoire, songs),
        [repertoire, songs],
    );
    const [query, setQuery] = useState("");
    const [expanded, setExpanded] = useState(false);
    const videoPlayback = useVideoPlayback();

    const filteredItems = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return items;

        return items.filter((item) =>
            item.title.toLowerCase().includes(normalizedQuery),
        );
    }, [items, query]);

    const visibleItems = expanded
        ? filteredItems
        : filteredItems.slice(0, INITIAL_VISIBLE);

    const hiddenCount = Math.max(filteredItems.length - INITIAL_VISIBLE, 0);
    const canExpand = hiddenCount > 0;

    return (
        <>
            <section className={className}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground tracking-tight">
                            Repertorio
                        </h2>
                        <p className="text-default-500 mt-2 text-sm sm:text-base">
                            {items.length}{" "}
                            {items.length === 1
                                ? "canción disponible"
                                : "canciones disponibles"}
                        </p>
                    </div>

                    <Input
                        value={query}
                        onValueChange={(value) => {
                            setQuery(value);
                            setExpanded(false);
                        }}
                        placeholder="Buscar canción..."
                        variant="bordered"
                        radius="lg"
                        className="max-w-xs"
                        aria-label="Filtrar repertorio"
                        startContent={
                            <Icon
                                icon="material-symbols:search"
                                width={18}
                                className="text-default-400"
                            />
                        }
                        isClearable
                        onClear={() => {
                            setQuery("");
                            setExpanded(false);
                        }}
                        classNames={UI.authInput}
                    />
                </div>

                {filteredItems.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-default-300 px-4 py-10 text-center">
                        <Icon
                            icon="material-symbols:search-off"
                            width={28}
                            className="mx-auto text-default-400 mb-2"
                        />
                        <p className="text-sm text-default-500">
                            No hay canciones que coincidan con tu búsqueda.
                        </p>
                    </div>
                ) : (
                    <>
                        <ol className="divide-y divide-default-200/70 border-y border-default-200/70">
                            {visibleItems.map((item, index) => (
                                <li
                                    key={`${item.title}-${index}`}
                                    className="flex items-center gap-3 py-3.5 hover:bg-default-50/80 transition-colors -mx-1 px-1 sm:mx-0 sm:px-0"
                                >
                                    <span className="w-7 shrink-0 text-xs font-semibold text-default-400 tabular-nums">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <span className="text-sm sm:text-base font-medium text-foreground truncate block">
                                            {item.title}
                                        </span>
                                        {item.youtubeUrl ? (
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-1 text-xs text-danger hover:underline mt-0.5"
                                                onClick={() =>
                                                    videoPlayback.openVideo(
                                                        item.youtubeUrl!,
                                                        item.title,
                                                    )
                                                }
                                            >
                                                <Icon
                                                    icon="mdi:youtube"
                                                    width={14}
                                                />
                                                Escuchar
                                            </button>
                                        ) : null}
                                    </div>
                                    {item.youtubeUrl ? (
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            radius="lg"
                                            aria-label={`Abrir ${item.title} en YouTube`}
                                            className="shrink-0 text-danger"
                                            onPress={() =>
                                                videoPlayback.openVideo(
                                                    item.youtubeUrl!,
                                                    item.title,
                                                )
                                            }
                                        >
                                            <Icon icon="mdi:youtube" width={20} />
                                        </Button>
                                    ) : null}
                                </li>
                            ))}
                        </ol>

                        {canExpand ? (
                            <div className="mt-6 flex justify-start">
                                <Button
                                    variant="flat"
                                    radius="lg"
                                    className="font-semibold"
                                    onPress={() => setExpanded((prev) => !prev)}
                                    endContent={
                                        <Icon
                                            icon={
                                                expanded
                                                    ? "material-symbols:expand-less"
                                                    : "material-symbols:expand-more"
                                            }
                                            width={20}
                                        />
                                    }
                                >
                                    {expanded
                                        ? "Ver menos"
                                        : `Ver ${hiddenCount} más`}
                                </Button>
                            </div>
                        ) : null}
                    </>
                )}
            </section>

            <VideoPlaybackModal
                isOpen={videoPlayback.isOpen}
                onOpenChange={videoPlayback.onOpenChange}
                url={videoPlayback.url}
                title={videoPlayback.title}
            />
        </>
    );
}
