import { MantineProvider } from "@mantine/core";
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
