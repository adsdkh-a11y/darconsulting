"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import Link from "next/link";
import type { Place } from "@/lib/places";

/** Map provider: OpenStreetMap tiles via Leaflet. Swappable (see docs/ARCHITECTURE.md → Maps). */
export default function LeafletMap({ center, places, located }: { center: { lat: number; lng: number }; places: Place[]; located: boolean }) {
  return (
    <div className="h-72 overflow-hidden rounded-3xl border border-line">
      <MapContainer key={`${center.lat},${center.lng}`} center={[center.lat, center.lng]} zoom={15} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {located && <CircleMarker center={[center.lat, center.lng]} radius={8} pathOptions={{ color: "#fff", weight: 2, fillColor: "#1b5fd1", fillOpacity: 1 }} />}
        {places.map((p) => (
          <CircleMarker key={p.id} center={[p.latitude, p.longitude]} radius={9}
            pathOptions={{ color: "#fff", weight: 2, fillColor: p.openNow === false ? "#8a8f8e" : "#6a3fc9", fillOpacity: 1 }}>
            <Popup><Link href={`/map/${p.id}`}>{p.name}</Link><br />{p.walkMinutes} min</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
