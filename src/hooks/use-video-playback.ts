"use client";

import { useCallback, useState } from "react";

export function useVideoPlayback() {
    const [url, setUrl] = useState<string | null>(null);
    const [title, setTitle] = useState<string | undefined>(undefined);

    const openVideo = useCallback((nextUrl: string, nextTitle?: string) => {
        setUrl(nextUrl);
        setTitle(nextTitle);
    }, []);

    const handleOpenChange = useCallback((open: boolean) => {
        if (!open) {
            setUrl(null);
            setTitle(undefined);
        }
    }, []);

    return {
        isOpen: url != null,
        url,
        title,
        openVideo,
        onOpenChange: handleOpenChange,
    };
}
