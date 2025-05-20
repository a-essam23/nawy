import { MantineProvider } from "@mantine/core";
import Layout from "@/components/layout"; // Assuming components is an alias for src/components
import { Notifications } from "@mantine/notifications";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <MantineProvider forceColorScheme="light">
      <Notifications />
      {children}
    </MantineProvider>
  );
};

export default Providers;
