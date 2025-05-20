"use client";
import {
  AppShell,
  AppShellMainProps,
  AppShellProps,
  Button,
  Stack,
} from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import LayoutHeader from "./header";
import cn from "@utils/cn";
import { globalRoutes } from "@stores/routes-store";
import Link from "next/link";

interface LayoutProps extends AppShellMainProps {
  children: React.ReactNode;
  className?: string;
  shellProps?: AppShellProps;
}

const Layout = ({
  children,
  className,
  shellProps,
  ...mainProps
}: LayoutProps) => {
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
      {...shellProps}
    >
      <LayoutHeader opened={opened} toggle={toggle} />
      <AppShell.Navbar p="md">
        <Stack gap="xs">
          {globalRoutes.map((r) => (
            <Button
              component={Link}
              key={r.href}
              href={r.href}
              className="capitalize"
            >
              {r.label}
            </Button>
          ))}
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main mb={"4rem"} {...mainProps} className={cn(className)}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
