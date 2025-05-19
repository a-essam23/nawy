import { formatArea, formatPrice } from "@/utils";
import { Badge, Box, Card, Text } from "@mantine/core";
import { ApartmentListingDto } from "@server";
import { IconBathFilled, IconBedFilled } from "@tabler/icons-react";
import Link from "next/link";
interface ApartmentListingCardProps {
  apartment: ApartmentListingDto;
}

const ApartmentListingCard: React.FC<ApartmentListingCardProps> = ({
  apartment,
}) => {
  return (
    <Card
      p={0}
      className="overflow-hidden transition-all duration-300"
      component={Link}
      href={`/apartments/${apartment.slug}`}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={apartment.coverImage}
          alt={apartment.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <Box className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge c="dimmed" variant="default" className="px-2 py-1 min-w-fit">
            {formatArea(apartment.area)}
          </Badge>
          <h3 className="font-semibold text-lg line-clamp-1">
            {apartment.name}
          </h3>
        </div>
        <div className="text-teal-600 text-xl font-bold mb-2">
          {formatPrice(apartment.price)}
        </div>
        <p className="text-gray-600 line-clamp-1 text-sm mb-3">
          {apartment.address}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge
            leftSection={<IconBedFilled size={20} />}
            // variant="outline"
            className="px-2 py-1"
          >
            {apartment.bedrooms} {apartment.bedrooms === 1 ? "Bed" : "Beds"}
          </Badge>
          <Badge
            leftSection={<IconBathFilled size={16} />}
            // variant="outline"
            className="px-2 py-1"
          >
            {apartment.bathrooms} {apartment.bathrooms === 1 ? "Bath" : "Baths"}
          </Badge>
        </div>
      </Box>
      <Text
        p={"xs"}
        size="sm"
        c="dimmed"
        className="grow flex items-center bg-black/5"
      >
        {apartment.project} • {apartment.developer}
      </Text>
    </Card>
  );
};

export default ApartmentListingCard;
