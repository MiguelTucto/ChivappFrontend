"use client";

import { useEffect, useState } from "react";
import { getContractorProfileStatus } from "@/lib/profiles";
import type { ProfileValidationOut } from "@/types/api";

export function useContractorVerification(
    enabled: boolean,
    userIsVerified = false,
) {
    const [status, setStatus] = useState<ProfileValidationOut | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        let cancelled = false;

        void Promise.resolve().then(() => {
            if (!cancelled) setHasLoaded(false);
        });

        getContractorProfileStatus()
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
    }, [enabled]);

    const profileIsVerified =
        (status?.status === "published" || status?.is_public === true) &&
        userIsVerified;

    return {
        isLoading: enabled && !hasLoaded,
        isVerified: enabled && profileIsVerified,
        status: enabled ? status : null,
    };
}
