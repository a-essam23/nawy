"use client";
import { useState } from "react";
import {
  Stack,
  Title,
  Text,
  SimpleGrid,
  Paper,
  Image,
  ActionIcon,
  Group,
  Box,
  Center,
  Alert,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import {
  IconUpload,
  IconPhoto,
  IconX,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import classes from "./image-upload-field.module.css";

interface ImageUploadFieldProps {
  files: FileWithPath[];
  onFilesChange: (files: FileWithPath[]) => void;
  coverImageIndex: number | null;
  onCoverImageChange: (index: number | null) => void;
  maxFiles?: number;
  maxFileSizeMB?: number;
}

export function ImageUploadField({
  files,
  onFilesChange,
  coverImageIndex,
  onCoverImageChange,
  maxFiles = 10,
  maxFileSizeMB = 5,
}: ImageUploadFieldProps) {
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (acceptedFiles: FileWithPath[]) => {
    setError(null);
    const currentFilesCount = files.length;
    const newTotalFiles = currentFilesCount + acceptedFiles.length;

    let filesToAdd = acceptedFiles;

    if (newTotalFiles > maxFiles) {
      setError(
        `You can upload a maximum of ${maxFiles} images. ${
          acceptedFiles.length - (maxFiles - currentFilesCount)
        } files were not added.`
      );
      filesToAdd = acceptedFiles.slice(
        0,
        Math.max(0, maxFiles - currentFilesCount)
      );
      if (filesToAdd.length === 0) return; // No space to add any new files
    }

    const updatedFiles = [...files, ...filesToAdd];
    onFilesChange(updatedFiles);

    // **Automatically set the first image as cover if no cover is set and files are present**
    if (coverImageIndex === null && updatedFiles.length > 0) {
      onCoverImageChange(0); // Set the very first image (index 0) in the combined list as cover
    }
  };

  const handleReject = (rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0 && rejectedFiles[0].errors) {
      setError(
        rejectedFiles[0].errors[0].message || "Some files were rejected."
      );
    } else {
      setError("Some files were rejected (e.g., wrong type or too large).");
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newFiles = files.filter((_, i) => i !== indexToRemove);
    onFilesChange(newFiles);
    // Adjust cover image index
    if (coverImageIndex === indexToRemove) {
      // If the removed image was the cover, set the new first image as cover, or null if no images left
      onCoverImageChange(newFiles.length > 0 ? 0 : null);
    } else if (coverImageIndex !== null && indexToRemove < coverImageIndex) {
      // If an image before the cover was removed, decrement the cover index
      onCoverImageChange(coverImageIndex - 1);
    }
  };

  const setAsCover = (index: number) => {
    onCoverImageChange(index);
  };

  const imagePreviews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    const isCover = index === coverImageIndex;
    return (
      <Paper
        key={file.path || `file-${index}`}
        shadow="sm"
        p="xs"
        withBorder
        pos="relative"
        className={classes.previewCard}
      >
        <Image
          src={imageUrl}
          onLoad={() => URL.revokeObjectURL(imageUrl)}
          alt={`preview ${file.name}`}
          height={120}
          fit="contain"
        />
        <Group
          className={classes.actionsOverlay}
          justify="space-between"
          pos="absolute"
          bottom={5}
          left={5}
          right={5}
        >
          <ActionIcon
            title={isCover ? "This is the cover image" : "Set as cover"}
            onClick={() => setAsCover(index)}
            variant={isCover ? "filled" : "light"}
            color={isCover ? "yellow" : "gray"}
            size="md"
          >
            {isCover ? (
              <IconStarFilled size="1rem" />
            ) : (
              <IconStar size="1rem" />
            )}
          </ActionIcon>
          <ActionIcon
            title="Remove image"
            color="red"
            variant="light"
            onClick={() => removeImage(index)}
            size="md"
          >
            <IconX size="1rem" />
          </ActionIcon>
        </Group>
        {isCover && (
          <Box className={classes.coverIndicator}>
            <Text size="xs" c="white">
              Cover
            </Text>
          </Box>
        )}
      </Paper>
    );
  });

  return (
    <Stack>
      <Title order={4} my="sm">
        Apartment Images
      </Title>
      <Dropzone
        onDrop={handleDrop}
        onReject={handleReject}
        maxSize={maxFileSizeMB * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        maxFiles={maxFiles - files.length} // Dynamically adjust maxFiles based on current count
        disabled={files.length >= maxFiles}
        className={classes.dropzone}
      >
        <Group
          justify="center"
          gap="xl"
          mih={150}
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <IconUpload size="3.2rem" stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size="3.2rem" stroke={1.5} color="red" />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size="3.2rem" stroke={1.5} />
          </Dropzone.Idle>
          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach up to {maxFiles} images, each should not exceed{" "}
              {maxFileSizeMB}MB.
            </Text>
          </div>
        </Group>
      </Dropzone>

      {error && (
        <Alert
          color="red"
          title="Upload Error"
          icon={<IconX />}
          withCloseButton
          onClose={() => setError(null)}
          mt="sm"
        >
          {error}
        </Alert>
      )}

      {files.length > 0 && (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} mt="md" spacing="sm">
          {imagePreviews}
        </SimpleGrid>
      )}
      {files.length === 0 && (
        <Center mt="md">
          <Text c="dimmed">No images uploaded yet.</Text>
        </Center>
      )}
    </Stack>
  );
}
