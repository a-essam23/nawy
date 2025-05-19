import { Button, Group, Title } from "@mantine/core";

interface ApartmentFilterSidebarTitleProps {
  isMobile: boolean;
  handleReset: () => void;
}

const ApartmentFilterSidebarTitle: React.FC<
  ApartmentFilterSidebarTitleProps
> = ({ handleReset, isMobile }) => {
  return (
    <Group justify="space-between" align="center" className="grow w-full">
      <Title order={isMobile ? 5 : 4}>Filters</Title>
      <Button variant="subtle" size="xs" onClick={handleReset} c="gray">
        Reset All
      </Button>
    </Group>
  );
};

export default ApartmentFilterSidebarTitle;
