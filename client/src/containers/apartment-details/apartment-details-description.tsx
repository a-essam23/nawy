import { IApartment } from "@ctypes";
import React from "react";

interface ApartmentDescriptionProps {
  apartment: IApartment;
}

const ApartmentDetailsDescription: React.FC<ApartmentDescriptionProps> = ({
  apartment,
}) => {
  return (
    <>
      <div>
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {apartment.description}
        </p>
      </div>
    </>
  );
};

export default ApartmentDetailsDescription;
