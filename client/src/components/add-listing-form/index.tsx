"use client";
import { useState } from "react";
import {
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Group,
  Stack,
  Title,
  Paper,
  SimpleGrid,
  Alert,
  LoadingOverlay,
  Stepper,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { joiResolver } from "@utils/joi-resolver";
import { IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { FileWithPath } from "@mantine/dropzone";
import { ImageUploadField } from "@components/image-upload-field";
import {
  apartmentValidationSchema,
  step1ApartmentSchema,
  step2ApartmentSchema,
} from "./add-listing-form.schema";
import { ObjectSchema } from "joi";
import { LocationInputGroup } from "@components/location-input-group";
import apiRequest from "@utils/axios";

interface ApartmentFormValues {
  name: string;
  description: string;
  address: string;
  price: number | "";
  bedrooms: number | "";
  bathrooms: number | "";
  area: number | "";
  unitNumber: string;
  project: string;
  developer: string;
  location: { latitude: number | ""; longitude: number | "" };
  files: FileWithPath[];
  coverImageIndex: number | null;
}

export function AddApartmentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const form = useForm<ApartmentFormValues>({
    initialValues: {
      name: "",
      description: "",
      address: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      unitNumber: "",
      project: "",
      developer: "",
      location: { latitude: "", longitude: "" },
      files: [],
      coverImageIndex: null,
    },
    validate: joiResolver(apartmentValidationSchema),
    // validateInputOnChange: true,
  });

  const handleSubmit = async (values: ApartmentFormValues) => {
    console.log("Form values:", values);
    form.clearErrors();
    const { error: validationError } = apartmentValidationSchema.validate(
      values,
      { abortEarly: false }
    );
    if (validationError) {
      form.setErrors(joiResolver(apartmentValidationSchema)(values)); // Populate form errors
      notifications.show({
        title: "Validation Error",
        message: "Please correct the errors before submitting.",
        color: "orange",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    if (values.files.length === 0 || values.coverImageIndex === null) {
      setError("Please upload images and select a cover image.");
      form.setFieldError(
        "files",
        "At least one image is required, and a cover must be selected."
      );
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("address", values.address);
    formData.append("price", String(values.price));
    formData.append("bedrooms", String(values.bedrooms));
    formData.append("bathrooms", String(values.bathrooms));
    formData.append("area", String(values.area));
    formData.append("unitNumber", values.unitNumber);
    formData.append("project", values.project);
    formData.append("developer", values.developer);
    if (values.location.latitude && values.location.longitude) {
      formData.append("location[latitude]", String(values.location.latitude));
      formData.append("location[longitude]", String(values.location.longitude));
    }

    formData.append("coverIndex", String(values.coverImageIndex));
    values.files.forEach((file) => {
      formData.append("images", file);
    });
    const { data, error } = await apiRequest({
      method: "POST",
      url: "/apartments",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (error) {
      setError(error.message || "An unknown error occurred.");
      notifications.show({
        title: "Error",
        message: error.message || "Failed to create apartment.",
        color: "red",
      });
      setIsLoading(false);
      return;
    }
    notifications.show({
      title: "Success!",
      message: `Apartment "${data.name}" created.`,
      color: "green",
    });
    form.reset();
    setActiveStep(0);
    setIsLoading(false);
  };

  const nextStep = async () => {
    let currentStepSchema: ObjectSchema;
    switch (activeStep) {
      case 0:
        currentStepSchema = step1ApartmentSchema;
        break;
      case 1:
        currentStepSchema = step2ApartmentSchema;
        break;
      default:
        return;
    }
    const { error: stepValidationError } = currentStepSchema.validate(
      form.values,
      { abortEarly: false, stripUnknown: true }
    );
    form.clearErrors();

    if (stepValidationError) {
      const stepErrors = joiResolver(currentStepSchema)(form.values);
      // Show errors for the current step schema, and clear others:
      form.setErrors(stepErrors);
      return;
    }
    setActiveStep((current) => (current < 2 ? current + 1 : current));
  };

  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  return (
    <Paper p="xl" shadow="md" withBorder>
      <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />
      <Title order={2} mb="xl" ta="center">
        Add New Apartment
      </Title>

      <Stepper
        active={activeStep}
        onStepClick={setActiveStep}
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="Basic Info" description="Main details">
          <Stack mt="md">
            <TextInput
              label="Apartment Name"
              placeholder="e.g., Cozy Downtown Studio"
              required
              {...form.getInputProps("name")}
            />
            <Textarea
              label="Description"
              placeholder="Detailed description"
              required
              minRows={3}
              {...form.getInputProps("description")}
            />
            <TextInput
              label="Address"
              placeholder="Full address"
              required
              {...form.getInputProps("address")}
            />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <NumberInput
                label="Price"
                placeholder="e.g., 500000"
                required
                min={0}
                step={1000}
                {...form.getInputProps("price")}
              />
              <NumberInput
                label="Area (m²)"
                placeholder="e.g., 75"
                required
                min={0}
                {...form.getInputProps("area")}
              />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <NumberInput
                label="Bedrooms"
                placeholder="e.g., 2"
                required
                min={0}
                allowDecimal={false}
                {...form.getInputProps("bedrooms")}
              />
              <NumberInput
                label="Bathrooms"
                placeholder="e.g., 1"
                required
                min={1}
                allowDecimal={false}
                {...form.getInputProps("bathrooms")}
              />
              <NumberInput
                label="Unit Number"
                placeholder="e.g., 3B"
                required
                {...form.getInputProps("unitNumber")}
              />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="Project Name"
                placeholder="e.g., The Grand Residences"
                required
                {...form.getInputProps("project")}
              />
              <TextInput
                label="Developer Name"
                placeholder="e.g., Urban Devs"
                required
                {...form.getInputProps("developer")}
              />
            </SimpleGrid>
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Location & Images" description="Map and photos">
          <Stack mt="md">
            <LocationInputGroup form={form} />

            <ImageUploadField
              files={form.values.files}
              onFilesChange={(newFiles) =>
                form.setFieldValue("files", newFiles)
              }
              coverImageIndex={form.values.coverImageIndex}
              onCoverImageChange={(index) =>
                form.setFieldValue("coverImageIndex", index)
              }
            />
            {form.errors.files && (
              <Text c="red" size="xs" mt="xs">
                {form.errors.files}
              </Text>
            )}
          </Stack>
        </Stepper.Step>

        <Stepper.Completed>
          <Text ta="center" my="xl">
            All steps completed! Review your details and submit.
          </Text>
        </Stepper.Completed>
      </Stepper>

      {error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Submission Error"
          color="red"
          mt="md"
        >
          {error}
        </Alert>
      )}

      <Group justify="flex-end" mt="xl">
        {activeStep > 0 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {activeStep < 2 && <Button onClick={nextStep}>Next step</Button>}
        {activeStep === 2 && (
          <Button
            type="submit"
            onClick={() => form.onSubmit(handleSubmit)()}
            loading={isLoading}
          >
            Submit Apartment
          </Button>
        )}
      </Group>
    </Paper>
  );
}
