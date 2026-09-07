"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useAuth } from "@/contexts/auth-context";
import { listNotifications, markNotificationRead } from "@/lib/notifications";
import type { NotificationOut } from "@/types/api";

const POLL_INTERVAL_MS = 30_000;

type NotificationsContextValue = {
    notifications: NotificationOut[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    markRead: (id: string) => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function canReceiveNotifications(role: string | undefined): boolean {
    return role === "musician" || role === "contractor" || role === "admin";
}

function sortNotifications(data: NotificationOut[]): NotificationOut[] {
    return [...data].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationOut[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        if (!user || !canReceiveNotifications(user.role)) return;

        try {
            const data = await listNotifications();
            setNotifications(sortNotifications(data));
            setError(null);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudieron cargar las notificaciones.",
            );
        } finally {
            setHasLoaded(true);
        }
    }, [user]);

    const markRead = useCallback(async (id: string) => {
        const updated = await markNotificationRead(id);
        setNotifications((current) =>
            current.map((item) => (item.id === id ? updated : item)),
        );
    }, []);

    useEffect(() => {
        if (!user || !canReceiveNotifications(user.role)) {
            setNotifications([]);
            setError(null);
            setHasLoaded(true);
            return;
        }

        let cancelled = false;

        void Promise.resolve().then(() => {
            if (!cancelled) setHasLoaded(false);
        });

        listNotifications()
            .then((data) => {
                if (!cancelled) {
                    setNotifications(sortNotifications(data));
                    setError(null);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "No se pudieron cargar las notificaciones.",
                    );
                }
            })
            .finally(() => {
                if (!cancelled) setHasLoaded(true);
            });

        return () => {
            cancelled = true;
        };
    }, [user]);

    useEffect(() => {
        if (!user || !canReceiveNotifications(user.role)) return;

        const interval = window.setInterval(() => {
            void refresh();
        }, POLL_INTERVAL_MS);

        function handleVisibilityChange() {
            if (document.visibilityState === "visible") {
                void refresh();
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            window.clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [refresh, user]);

    const unreadCount = useMemo(
        () => notifications.filter((notification) => !notification.is_read).length,
        [notifications],
    );

    const isLoading =
        !!user && canReceiveNotifications(user.role) && !hasLoaded;

    const value = useMemo(
        () => ({
            notifications,
            unreadCount,
            isLoading,
            error,
            refresh,
            markRead,
        }),
        [notifications, unreadCount, isLoading, error, refresh, markRead],
    );

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error("useNotifications must be used within NotificationsProvider");
    }
    return context;
}
