import {
  ActionIcon,
  Button,
  Divider,
  Group,
  RangeSlider,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  ApartmentFilterState,
  useApartmentFilterStore,
} from "@stores/apartment-filter-store";
import ApartmentFilterSidebarTitle from "./filter-sidebar-title";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { formatArea, formatPrice } from "@utils/index";

interface ApartmentFilterSidebarContentProps {
  isMobile: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  withSearch?: boolean;
  maxPrice?: number;
  maxArea?: number;
}
interface FilterFormValues {
  searchTerm?: string;
  priceRange: [number, number];
  areaRange: [number, number];
  minBedrooms?: string;
  minBathrooms?: string;
  project?: string;
  developer?: string;
  sortBy?: ApartmentFilterState["sortBy"];
  sortOrder?: ApartmentFilterState["sortOrder"];
}

const bedroomOptions = [
  { value: "", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];
const bathroomOptions = [
  { value: "", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];
const sortOptions = [
  { value: "createdAt", label: "Date" },
  { value: "price", label: "Price" },
  { value: "area", label: "Area (Size)" },
  { value: "bedrooms", label: "Bedrooms" },
];

const ApartmentFilterSidebarContent: React.FC<
  ApartmentFilterSidebarContentProps
> = ({
  closeDrawer,
  isMobile,
  openDrawer,
  maxArea = 1000,
  maxPrice = 50000000,
  withSearch,
}) => {
  const store = useApartmentFilterStore();

  const form = useForm<FilterFormValues>({
    initialValues: {
      searchTerm: store.searchTerm || "",
      priceRange: [store.minPrice || 0, store.maxPrice || maxPrice],
      areaRange: [store.minArea || 0, store.maxArea || maxArea],
      minBedrooms: store.minBedrooms?.toString() || "",
      minBathrooms: store.minBathrooms?.toString() || "",
      project: store.project || "",
      developer: store.developer || "",
      sortBy: store.sortBy || "createdAt",
      sortOrder: store.sortOrder || "desc",
    },
  });
  const handleSubmit = (values: FilterFormValues) => {
    console.log("Form submitted (or would be if Apply button used):", values);
    store.updateFilters({
      ...values,
      minBedrooms: parseInt(values.minBedrooms || "0"),
      minBathrooms: parseInt(values.minBathrooms || "0"),
    });

    if (isMobile) closeDrawer();
  };

  const handleReset = () => {
    store.resetFilters(); // This will trigger the useEffect to reset form values
    form.reset(); // Also reset Mantine form's dirty/submitted state
    if (isMobile) closeDrawer();
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="lg" p="xs">
        {!isMobile && (
          <ApartmentFilterSidebarTitle
            handleReset={handleReset}
            isMobile={isMobile}
          />
        )}
        <ScrollArea
          mah={isMobile ? "75vh" : "70vh"}
          type="hover"
          offsetScrollbars
        >
          <>
            {withSearch && (
              <TextInput
                label="Search Listings"
                placeholder="Name, project, developer..."
                leftSection={<IconSearch size="1rem" />}
                rightSection={
                  form.values.project ? (
                    <ActionIcon
                      onClick={() => {
                        form.setFieldValue("project", "");
                      }}
                      title="Clear project"
                    >
                      <IconX size="1rem" />
                    </ActionIcon>
                  ) : null
                }
                {...form.getInputProps("searchTerm")}
              />
            )}
            <Divider label="Sort By" labelPosition="left" my="xs" />
            <Group grow>
              <Select
                data={sortOptions}
                placeholder="Sort by"
                {...form.getInputProps("sortBy")}
                onChange={(value) => {
                  form.setFieldValue(
                    "sortBy",
                    value as FilterFormValues["sortBy"]
                  );
                  if (isMobile) setTimeout(closeDrawer, 150);
                }}
              />
              <Select
                data={[
                  { value: "asc", label: "Ascending" },
                  { value: "desc", label: "Descending" },
                ]}
                placeholder="Order"
                {...form.getInputProps("sortOrder")}
                onChange={(value) => {
                  form.setFieldValue(
                    "sortOrder",
                    value as FilterFormValues["sortOrder"]
                  );
                  if (isMobile) setTimeout(closeDrawer, 150);
                }}
              />
            </Group>
            <Divider label="Price Range" labelPosition="left" my="xs" />
            <RangeSlider
              px="xl"
              min={0}
              max={maxPrice}
              step={50000}
              label={(value) => formatPrice(value)}
              thumbChildren={
                <>
                  <IconChevronDown size="1rem" />
                  <IconChevronUp size="1rem" />
                </>
              }
              {...form.getInputProps("priceRange")} // Bind to form
            />
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                {formatPrice(form.values.priceRange[0])}
              </Text>
              <Text size="xs" c="dimmed">
                {formatPrice(form.values.priceRange[1])}
              </Text>
            </Group>
            <Divider label="Area (sqm)" labelPosition="left" my="xs" />
            <RangeSlider
              px="xl"
              min={0}
              max={maxArea}
              step={10}
              label={(value) => formatArea(value)}
              {...form.getInputProps("areaRange")}
            />
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                {formatArea(form.values.areaRange[0])}
              </Text>
              <Text size="xs" c="dimmed">
                {formatArea(form.values.areaRange[1])}
              </Text>
            </Group>
            <Divider label="Property Details" labelPosition="left" my="xs" />
            <Select
              label="Min. Bedrooms"
              data={bedroomOptions}
              clearable
              placeholder="Any"
              {...form.getInputProps("minBedrooms")}
            />
            <Select
              label="Min. Bathrooms"
              data={bathroomOptions}
              clearable
              placeholder="Any"
              {...form.getInputProps("minBathrooms")}
            />
            <TextInput
              label="Project Name"
              placeholder="Enter project name"
              {...form.getInputProps("project")}
              rightSection={
                form.values.project ? (
                  <ActionIcon
                    onClick={() => {
                      form.setFieldValue("project", "");
                    }}
                    title="Clear project"
                  >
                    <IconX size="1rem" />
                  </ActionIcon>
                ) : null
              }
            />
            <TextInput
              label="Developer Name"
              placeholder="Enter developer name"
              {...form.getInputProps("developer")}
              rightSection={
                form.values.developer ? (
                  <ActionIcon
                    onClick={() => {
                      form.setFieldValue("developer", "");
                    }}
                    title="Clear developer"
                  >
                    <IconX size="1rem" />
                  </ActionIcon>
                ) : null
              }
            />
          </>
        </ScrollArea>
        <Button
          type="submit"
          fullWidth
          mt="md"
          variant={form.isDirty() ? "filled" : "default"}
        >
          Apply Filters
        </Button>
      </Stack>
    </form>
  );
};

export default ApartmentFilterSidebarContent;
