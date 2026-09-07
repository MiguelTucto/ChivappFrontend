"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

function InvalidateSize() {
    const map = useMap();
    useEffect(() => {
        const id = window.setTimeout(() => map.invalidateSize(), 80);
        return () => window.clearTimeout(id);
    }, [map]);
    return null;
}

type Props = {
    lat: number;
    lng: number;
};

export default function LocationMapPreviewInner({ lat, lng }: Props) {
    return (
        <div className="relative h-52 sm:h-60 rounded-2xl overflow-hidden border border-default-200 isolate">
            <MapContainer
                center={[lat, lng]}
                zoom={15}
                className="h-full w-full"
                scrollWheelZoom={false}
                dragging
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]} icon={markerIcon} />
                <InvalidateSize />
            </MapContainer>
        </div>
    );
}
