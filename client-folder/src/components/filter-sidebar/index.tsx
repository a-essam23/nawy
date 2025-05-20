"use client";

import { Box, ActionIcon, useMantineTheme, Drawer } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import ApartmentFilterSidebarTitle from "./filter-sidebar-title";
import ApartmentFilterSidebarContent from "./filter-sidebar-content";
import { useApartmentFilterStore } from "@stores/apartment-filter-store";

interface ApartmentFiltersSidebarProps {
  withSearch?: boolean;
}

const ApartmentFiltersSidebar: React.FC<ApartmentFiltersSidebarProps> = ({
  withSearch = true,
}) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xl})`);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { resetFilters } = useApartmentFilterStore();

  if (isMobile) {
    return (
      <>
        <ActionIcon size="lg" onClick={openDrawer}>
          <IconFilter />
        </ActionIcon>
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          position="left"
          title={
            <ApartmentFilterSidebarTitle
              isMobile={isMobile}
              handleReset={resetFilters}
            />
          }
        >
          <ApartmentFilterSidebarContent
            closeDrawer={closeDrawer}
            isMobile={true}
            openDrawer={openDrawer}
          />
        </Drawer>
      </>
    );
  }

  return (
    <Box
      w={350}
      className="fixed left-0 top-2/4 -translate-y-2/4 border border-l-0 border-gray-200"
      p={"md"}
    >
      <ApartmentFilterSidebarContent
        closeDrawer={closeDrawer}
        isMobile={false}
        openDrawer={openDrawer}
      />
    </Box>
  );
};
export default ApartmentFiltersSidebar;
