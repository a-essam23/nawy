import { MantineProvider } from "@mantine/core";
import Layout from "@/components/layout"; // Assuming components is an alias for src/components

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <MantineProvider forceColorScheme="light">{children}</MantineProvider>;
};

export default Providers;
