"use client";

import { useEffect, useState } from "react";
import {
    getContractorProfileStatus,
    getMusicianProfileStatus,
} from "@/lib/profiles";
import type { ProfileValidationOut, UserRole } from "@/types/api";

type Role = Extract<UserRole, "musician" | "contractor">;

export function useProfileVerification(
    role: Role,
    enabled: boolean,
    userIsVerified = false,
) {
    const [status, setStatus] = useState<ProfileValidationOut | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        let cancelled = false;
        const fetchStatus =
            role === "musician" ? getMusicianProfileStatus : getContractorProfileStatus;

        void Promise.resolve().then(() => {
            if (!cancelled) setHasLoaded(false);
        });

        fetchStatus()
            .then((data) => {
                if (!cancelled) setStatus(data);
            })
            .catch(() => {
                if (!cancelled) setStatus(null);
            })
            .finally(() => {
                if (!cancelled) setHasLoaded(true);
            });

        return () => {
            cancelled = true;
        };
    }, [enabled, role]);

    const profileIsVerified =
        (status?.status === "published" || status?.is_public === true) &&
        userIsVerified;

    return {
        isLoading: enabled && !hasLoaded,
        isVerified: enabled && profileIsVerified,
        status: enabled ? status : null,
    };
}
