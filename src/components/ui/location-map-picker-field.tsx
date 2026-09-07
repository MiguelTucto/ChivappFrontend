"use client";

import dynamic from "next/dynamic";
import type { MapLocation } from "@/lib/geocoding";

const LocationMapPicker = dynamic(() => import("@/components/ui/location-map-picker"), {
    ssr: false,
    loading: () => (
        <div className="h-72 rounded-2xl border border-default-200 bg-default-100 animate-pulse" />
    ),
});

export type { MapLocation };
export default LocationMapPicker;
