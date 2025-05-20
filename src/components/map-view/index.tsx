"use client";

import { useEffect, useState } from "react";
import { Icon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Important: Import Leaflet CSS
import { placeMarkerIcon } from "./map-icon";

export interface MapProps {
  location: [number, number];
  address: string;
  zoom?: number;
  title?: string;
}

const MapView: React.FC<MapProps> = ({
  address,
  location,
  title = "Map view",
  zoom = 13,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side only rendering
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return <div className="w-full h-full bg-gray-100 rounded-lg" />;
  }

  return (
    <MapContainer
      center={location}
      zoom={zoom}
      zoomControl={false}
      className="w-full h-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={location} icon={placeMarkerIcon()}>
        <Popup>
          <strong>{title}</strong>
          <br />
          {address}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
