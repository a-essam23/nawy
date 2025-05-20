import React from "react";
import { IApartmentPublic } from "@server";
import ImageGallery from "@components/image-gallery";
import ApartmentDetailsDescription from "./apartment-details-description";
import ApartmentDetailsHeader from "./apartment-details-header";
import ApartmentLocation from "./apartment-details-location";
import ApartmentDetailsContact from "./apartment-details-contact";
import { Title } from "@mantine/core";

interface ApartmentDetailsProps {
  apartment: IApartmentPublic;
}

const ApartmentDetails: React.FC<ApartmentDetailsProps> = ({ apartment }) => {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <Title
          order={1}
          fz={{ base: "lg", lg: "h1" }}
          className="font-bold mb-2 capitalize"
        >
          {apartment.name}
        </Title>
        <p className="text-gray-600 capitalize">{apartment.address}</p>
      </div>

      <ImageGallery
        images={apartment.images}
        alt={apartment.name}
        coverImage={apartment.coverImage}
        location={apartment.address}
        name={apartment.name}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ApartmentDetailsHeader apartment={apartment} />
          <ApartmentDetailsDescription apartment={apartment} />
          <ApartmentLocation apartment={apartment} />
        </div>

        <div className="space-y-6">
          <ApartmentDetailsContact
            name={apartment.name}
            slug={apartment.slug}
          />
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetails;
