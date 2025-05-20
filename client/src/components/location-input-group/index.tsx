"use client";

import { useState } from "react";
import {
  SimpleGrid,
  NumberInput,
  Button,
  Group,
  Tooltip,
  Text,
  Title,
  Box,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconCurrentLocation } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

interface LocationInputGroupProps {
  // eslint-disable-next-line
  form: UseFormReturnType<any>;
}

export function LocationInputGroup({ form }: LocationInputGroupProps) {
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      notifications.show({
        title: "Geolocation Not Supported",
        message: "Your browser does not support geolocation.",
        color: "orange",
      });
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));

        form.setFieldValue("location.latitude", lat);
        form.setFieldValue("location.longitude", lng);

        // Trigger validation for these specific fields after setting them
        form.validateField("location.latitude");
        form.validateField("location.longitude");

        setIsFetchingLocation(false);
        notifications.show({
          title: "Location Fetched",
          message: "Current location has been filled in.",
          color: "teal",
        });
      },
      (geoError) => {
        console.warn(`ERROR(${geoError.code}): ${geoError.message}`);
        setIsFetchingLocation(false);
        let message = "Could not get your current location.";
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            message = "You denied the request for Geolocation.";
            break;
          case geoError.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
          case geoError.TIMEOUT:
            message = "The request to get user location timed out.";
            break;
        }
        notifications.show({
          title: "Geolocation Error",
          message: message,
          color: "red",
        });
        form.setFieldError("location", message);
      }
    );
  };

  return (
    <Box>
      <Group justify="space-between" align="flex-end" mb="sm">
        <Title order={4}>Location</Title>
        <Tooltip label="Use your current browser location">
          <Button
            variant="light"
            size="xs"
            leftSection={<IconCurrentLocation size="1rem" />}
            onClick={handleUseCurrentLocation}
            loading={isFetchingLocation}
            disabled={isFetchingLocation}
          >
            Use Current Location
          </Button>
        </Tooltip>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <NumberInput
          label="Latitude"
          placeholder="-90 to 90"
          required
          decimalScale={6}
          step={0.000001}
          {...form.getInputProps("location.latitude")}
        />
        <NumberInput
          label="Longitude"
          placeholder="-180 to 180"
          required
          decimalScale={6}
          step={0.000001}
          {...form.getInputProps("location.longitude")}
        />
      </SimpleGrid>
      {form.errors.location && typeof form.errors.location === "string" && (
        <Text c="red" size="xs" mt={5}>
          {form.errors.location}
        </Text>
      )}
    </Box>
  );
}
