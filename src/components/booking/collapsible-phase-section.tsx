"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

type Props = {
    icon: string;
    title: string;
    summary?: string;
    /** Ya completado (colapsa por defecto) vs. aún pendiente (expandido). */
    done: boolean;
    doneLabel?: string;
    pendingLabel?: string;
    /** Fuerza el estado inicial; por defecto se deriva de `done`. */
    defaultExpanded?: boolean;
    children: React.ReactNode;
};

export default function CollapsiblePhaseSection({
    icon,
    title,
    summary,
    done,
    doneLabel = "Completado",
    pendingLabel = "Pendiente",
    defaultExpanded,
    children,
}: Props) {
    const [expanded, setExpanded] = useState(defaultExpanded ?? !done);

    return (
        <div className="flex flex-col gap-3">
            <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                className="w-full flex items-center justify-between gap-3 rounded-2xl border border-default-200/70 bg-content1 px-5 py-3.5 text-left shadow-soft hover:border-default-300 transition-colors"
            >
                <span className="flex items-center gap-3 min-w-0">
                    <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                            done ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                        }`}
                    >
                        <Icon icon={icon} width={20} />
                    </span>
                    <span className="min-w-0">
                        <span className="block font-bold text-foreground truncate">
                            {title}
                        </span>
                        {summary ? (
                            <span className="block text-xs text-default-500 truncate">
                                {summary}
                            </span>
                        ) : null}
                    </span>
                </span>
                <span className="flex items-center gap-2 shrink-0">
                    <span
                        className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            done ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                        }`}
                    >
                        {done ? doneLabel : pendingLabel}
                    </span>
                    <Icon
                        icon="material-symbols:keyboard-arrow-down-rounded"
                        width={22}
                        className={`text-default-500 transition-transform duration-300 ${
                            expanded ? "rotate-180" : ""
                        }`}
                    />
                </span>
            </button>

            {expanded ? <div className="animate-fade-in-up">{children}</div> : null}
        </div>
    );
}
