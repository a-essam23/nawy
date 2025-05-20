import { AppShell, Burger, Group, Text } from "@mantine/core";
import { globalRoutes } from "@stores/routes-store";
import Link from "next/link";
interface LayoutProps {
  opened: boolean;
  toggle: () => void;
}

const LayoutHeader: React.FC<LayoutProps> = ({ opened, toggle }) => {
  return (
    <AppShell.Header
      className={"bg-white/10! backdrop-blur-lg flex justify-between"}
    >
      <Group h="100%" px="md">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Link href="/" className="transition flex items-center">
          <Text
            fz="xl"
            c={"blue"}
            span
            fw={"bold"}
            ff={"var(--font-cairo)"}
            lh={0}
          >
            Apartment
          </Text>
          <Text fw={"bold"} span c="blue" fz={"lg"} ta="end" lh="0">
            Finder
          </Text>
        </Link>
      </Group>
      <Group visibleFrom="lg" h="100%" px="md" className="capitalize">
        {globalRoutes.map((r) => (
          <Link key={r.href} href={r.href}>
            {r.label}
          </Link>
        ))}
      </Group>
    </AppShell.Header>
  );
};

export default LayoutHeader;
