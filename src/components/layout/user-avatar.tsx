"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@heroui/react";
import { resolveUploadUrl } from "@/lib/uploads";
import { getMusicianProfile } from "@/lib/profiles";
import type { UserOut } from "@/types/api";

export function getUserInitials(fullname: string | null | undefined): string {
    if (!fullname?.trim()) return "?";
    const parts = fullname.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

type Props = {
    user: UserOut;
    size?: "sm" | "md" | "lg";
    className?: string;
    showBorder?: boolean;
};

export default function UserAvatar({
    user,
    size = "sm",
    className,
    showBorder = false,
}: Props) {
    const fromUser = resolveUploadUrl(user.profile_picture_url);
    const [musicianImageUrl, setMusicianImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (fromUser || user.role !== "musician") {
            return;
        }

        let cancelled = false;
        getMusicianProfile()
            .then((profile) => {
                if (!cancelled) {
                    setMusicianImageUrl(resolveUploadUrl(profile.profile_image_url));
                }
            })
            .catch(() => {
                if (!cancelled) setMusicianImageUrl(null);
            });

        return () => {
            cancelled = true;
        };
    }, [fromUser, user.id, user.role, user.profile_picture_url]);

    const imageUrl =
        fromUser ?? (user.role === "musician" ? musicianImageUrl : null);

    return (
        <Avatar
            src={imageUrl ?? undefined}
            name={getUserInitials(user.fullname)}
            showFallback
            getInitials={() => getUserInitials(user.fullname)}
            size={size}
            className={`${showBorder ? "ring-2 ring-primary/20" : ""} ${className ?? ""}`}
            classNames={{
                base: "bg-secondary/15 text-secondary shrink-0",
                name: "font-semibold",
            }}
        />
    );
}
