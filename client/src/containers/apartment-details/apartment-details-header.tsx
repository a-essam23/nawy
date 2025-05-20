import { Badge } from "@mantine/core";
import { IApartmentPublic } from "@server";
import { formatArea, formatPrice } from "@utils/index";
import React from "react";

interface ApartmentHeaderProps {
  apartment: IApartmentPublic;
}

const ApartmentDetailsHeader: React.FC<ApartmentHeaderProps> = ({
  apartment,
}) => {
  return (
    <div className="border-b pb-4">
      <div className="text-3xl font-bold text-teal-600 mb-2">
        {formatPrice(apartment.price)}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline" className="px-3 py-1.5 text-sm">
          {apartment.bedrooms}{" "}
          {apartment.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
        </Badge>
        <Badge variant="outline" className="px-3 py-1.5 text-sm">
          {apartment.bathrooms}{" "}
          {apartment.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
        </Badge>
        <Badge variant="outline" className="px-3 py-1.5 text-sm">
          {formatArea(apartment.area)}
        </Badge>
        {apartment.unitNumber && (
          <Badge variant="outline" className="px-3 py-1.5 text-sm">
            Unit {apartment.unitNumber}
          </Badge>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 text-sm">
        <div>
          <span className="font-medium text-gray-700 capitalize">
            Project:{" "}
          </span>
          <span className="text-gray-600 capitalize">{apartment.project}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700 ">Developer: </span>
          <span className="text-gray-600 capitalize">
            {apartment.developer}
          </span>
        </div>
      </div>
    </div>
  );
};
export default ApartmentDetailsHeader;
