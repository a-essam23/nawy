import React from "react";
import DynamicMapView from "@components/map-view/map-view-dynamic";
import { IApartment } from "@ctypes";

interface ApartmentLocationProps {
  apartment: IApartment;
}

const ApartmentLocation: React.FC<ApartmentLocationProps> = ({ apartment }) => {
  return (
    <div className="w-full aspect-video">
      <h2 className="text-xl font-semibold mb-4">Location</h2>
      <DynamicMapView
        title={apartment.name}
        address={apartment.address}
        location={apartment.location.coordinates as [number, number]}
      />
    </div>
  );
};

export default ApartmentLocation;
