"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { useIsClient } from "@/hooks/use-is-client";

type Props = {
    size?: "sm" | "md" | "lg";
};

const ICON_SIZE: Record<NonNullable<Props["size"]>, number> = {
    sm: 18,
    md: 22,
    lg: 24,
};

export default function ThemeToggle({ size = "md" }: Props) {
    const { resolvedTheme, setTheme } = useTheme();
    const isClient = useIsClient();
    const isDark = isClient && resolvedTheme === "dark";
    const iconSize = ICON_SIZE[size];

    return (
        <Button
            isIconOnly
            size={size}
            variant="flat"
            radius="lg"
            aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            className="text-default-600"
            onPress={() => setTheme(isDark ? "light" : "dark")}
        >
            {isClient ? (
                <span
                    className="relative inline-flex items-center justify-center"
                    style={{ width: iconSize, height: iconSize }}
                >
                    <Icon
                        icon="material-symbols:light-mode-outline"
                        width={iconSize}
                        height={iconSize}
                        className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                            isDark
                                ? "opacity-100 rotate-0 scale-100"
                                : "opacity-0 -rotate-90 scale-50"
                        }`}
                    />
                    <Icon
                        icon="material-symbols:dark-mode-outline"
                        width={iconSize}
                        height={iconSize}
                        className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                            isDark
                                ? "opacity-0 rotate-90 scale-50"
                                : "opacity-100 rotate-0 scale-100"
                        }`}
                    />
                </span>
            ) : (
                <span
                    style={{ width: iconSize, height: iconSize }}
                    aria-hidden
                />
            )}
        </Button>
    );
}
