"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
    children: React.ReactNode;
    index?: number;
};

const ROW_HEIGHT = 10;

export default function MasonryItem({ children, index = 0 }: Props) {
    const itemRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [span, setSpan] = useState(1);

    useEffect(() => {
        const item = itemRef.current;
        const content = contentRef.current;
        if (!item || !content) return;

        const calculateSpan = () => {
            const grid = item.parentElement;
            if (!grid) return;

            const styles = getComputedStyle(grid);
            const gap = Number.parseFloat(styles.rowGap) || 0;
            const height = content.getBoundingClientRect().height;
            const nextSpan = Math.max(
                1,
                Math.ceil((height + gap) / (ROW_HEIGHT + gap)),
            );
            setSpan((current) => (current === nextSpan ? current : nextSpan));
        };

        calculateSpan();

        const resizeObserver = new ResizeObserver(() => {
            calculateSpan();
        });
        resizeObserver.observe(content);
        resizeObserver.observe(item.parentElement ?? item);

        const images = content.querySelectorAll("img");
        const onImageLoad = () => calculateSpan();
        images.forEach((img) => {
            if (img.complete) return;
            img.addEventListener("load", onImageLoad);
        });

        return () => {
            resizeObserver.disconnect();
            images.forEach((img) => img.removeEventListener("load", onImageLoad));
        };
    }, [children]);

    return (
        <div
            ref={itemRef}
            className="min-w-0 w-full"
            style={{ gridRowEnd: `span ${span}` }}
        >
            <div
                ref={contentRef}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
            >
                {children}
            </div>
        </div>
    );
}
