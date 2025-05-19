import { AppShell, Burger, Group, Text } from "@mantine/core";
import Link from "next/link";
interface LayoutProps {
  opened: boolean;
  toggle: () => void;
  pinned: boolean;
}

const LayoutHeader: React.FC<LayoutProps> = ({ opened, toggle, pinned }) => {
  return (
    <AppShell.Header className={"bg-white/10! backdrop-blur-lg"}>
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
    </AppShell.Header>
  );
};

export default LayoutHeader;
