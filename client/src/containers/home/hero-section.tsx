import cn from "@/utils/cn";
import { Box, Button, Container, Text, Title } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  return (
    <Box
      className={cn(
        "relative flex flex-col justify-center items-center bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden h-screen gap-8",
        className
      )}
    >
      <Image
        src="/hero-cover.jpg"
        alt="Luxury Apartment hero image"
        className="object-cover opacity-30"
        fill
        priority
      />

      <Container className="relative container flex flex-col items-center text-center">
        <Title c={"white"} order={1} fz={{ lg: "4rem" }}>
          Find Your Perfect Apartment
        </Title>

        <Text fz={"lg"} c={"white"} opacity={0.7} maw="80%">
          Discover exceptional homes and apartments tailored to your lifestyle
          and preferences
        </Text>
      </Container>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg group"
          size="lg"
          component={Link}
          href={"/apartments"}
          // leftSection={
          //   <IconPlus className="transition opacity-0 group-hover:opacity-100" />
          // }
        >
          View Listings
        </Button>

        <Button
          className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg group"
          size="lg"
          component={Link}
          bg="orange"
          href={"/apartments/add"}
          // leftSection={<IconBuilding />}
        >
          Add New Listing
        </Button>
      </div>
    </Box>
  );
};

export default HeroSection;
