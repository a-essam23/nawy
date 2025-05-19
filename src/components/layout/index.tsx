"use client";
import {
  AppShell,
  AppShellMainProps,
  AppShellProps,
  Burger,
  Group,
  Skeleton,
  Text,
} from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import LayoutHeader from "./header";
import cn from "@utils/cn";

interface LayoutProps extends AppShellProps {
  children: React.ReactNode;
  className?: string;
  mainProps?: AppShellMainProps;
}

const Layout = ({ children, className, mainProps }: LayoutProps) => {
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
      <AppShell.Main
        mb={"4rem"}
        {...mainProps}
        className={cn(className, mainProps?.className)}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
