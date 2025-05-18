"use client";
import { AppShell, Burger, Group, Skeleton, Text } from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import LayoutHeader from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [opened, { toggle }] = useDisclosure();
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <AppShell
      header={{ height: 60, offset: true, collapsed: !pinned }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: !opened },
      }}
    >
      <LayoutHeader opened={opened} toggle={toggle} pinned={pinned} />
      <AppShell.Navbar p="md">
        Navbar
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default Layout;
