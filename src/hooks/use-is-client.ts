"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => undefined;

/**
 * false during SSR and the hydration render; true only after the client takes over.
 * Prefer this over useState+useEffect for auth/theme UI that must match server HTML.
 */
export function useIsClient(): boolean {
    return useSyncExternalStore(emptySubscribe, () => true, () => false);
}
