import { AddApartmentForm } from "@components/add-listing-form";
import Layout from "@components/layout";
import { Container } from "@mantine/core";

const ApartmentAddPage = () => {
  return (
    <Layout>
      <Container size="xl" mt="xl">
        <AddApartmentForm />
      </Container>
    </Layout>
  );
};

export default ApartmentAddPage;
