"use client";
import { useState } from "react";
import { Carousel } from "@mantine/carousel";
import { Box, Container, Modal, Text, UnstyledButton } from "@mantine/core";
import Image from "next/image";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconLayoutNavbarExpand,
} from "@tabler/icons-react";

interface ImageGalleryProps {
  name: string;
  location: string;
  coverImage: string;
  images: string[];
  alt: string;
}
const ImageGallery: React.FC<ImageGalleryProps> = ({
  location,
  name,
  coverImage,
  images,
  alt,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [activeImage, setActiveImage] = useState(coverImage);
  const [activeIndex, setActiveIndex] = useState(0);

  // Cover images is already included in the images array. Maybe will change later...
  const allImages = images;

  const handleImageClick = (image: string, index: number) => {
    setActiveImage(image);
    setActiveIndex(index);
    open();
  };

  return (
    <Box className="w-full">
      <Container size="lg">
        <UnstyledButton
          className="relative mb-4 cursor-pointer bg-red-50 w-full aspect-video rounded overflow-hidden"
          onClick={() => handleImageClick(coverImage, 0)}
        >
          <Image src={coverImage} alt={name} className="object-cover" fill />
        </UnstyledButton>
      </Container>

      <Carousel
        withControls={images.length > 4}
        nextControlIcon={<IconChevronRight size={16} />}
        previousControlIcon={<IconChevronLeft size={16} />}
        slideSize={{ base: "25%", lg: "20%" }}
        emblaOptions={{}}
        classNames={
          images.length < 4 ? { container: "justify-center" } : undefined
        }
      >
        {allImages.map((image, index) => (
          <Carousel.Slide
            key={index}
            className="flex relative w-24 aspect-square lg:aspect-video rounded overflow-hidden mx-2"
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Apartment image ${index + 1}`}
              className="object-cover cursor-pointer"
              fill
              onClick={() => handleImageClick(image, index)}
            />
          </Carousel.Slide>
        ))}
      </Carousel>

      <Modal
        opened={opened}
        onClose={close}
        fullScreen
        centered
        withCloseButton
        title={
          <Text fz={"h3"} span>
            {name}
          </Text>
        }
      >
        <div className="flex h-[80vh] ">
          <Carousel
            initialSlide={activeIndex}
            withIndicators
            withControls
            slideSize={"100%"}
            nextControlIcon={<IconChevronRight size={24} />}
            previousControlIcon={<IconChevronLeft size={24} />}
            className="w-full h-full"
            classNames={{
              indicator:
                "bg-gray-500! w-4! h-auto! aspect-square! opacity-50! data-[active]:opacity-100! data-[active]:scale-125! data-[active]:bg-amber-500!",
            }}
          >
            {allImages.map((image, index) => (
              <Carousel.Slide className="flex h-[76vh] relative " key={index}>
                <Image
                  src={image}
                  alt={`${name}-image ${index + 1}`}
                  className="object-contain"
                  fill
                />
              </Carousel.Slide>
            ))}
          </Carousel>
        </div>
      </Modal>
    </Box>
  );
};

export default ImageGallery;
