import { Badge } from "@mantine/core";
import { IApartmentPublic } from "@server";
import React from "react";

interface ApartmentDescriptionProps {
  apartment: IApartmentPublic;
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

      {apartment.amenities && apartment.amenities.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {apartment.amenities.map((amenity, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1.5 text-sm"
              >
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ApartmentDetailsDescription;
