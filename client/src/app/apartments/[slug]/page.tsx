import Layout from "@components/layout";
import apiRequest from "@utils/axios";
import { IApartmentPublic } from "@server";
import { Button, Container } from "@mantine/core";
import Link from "next/link";
import ApartmentDetails from "@containers/apartment-details";

const ApartmentDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const { data: apartment, error } = await apiRequest<IApartmentPublic>({
    method: "GET",
    url: `apartments/${slug}`,
  });
  if (!apartment) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Listing Not Found</h2>
          <p className="text-gray-600 mb-8">
            The listing you're looking for doesn't exist or has been removed.
          </p>
          <Button component={Link} href="/apartments">
            Back to All Listings
          </Button>
        </div>
      </Layout>
    );
  }
  return (
    <Layout mt={"xl"}>
      <Container size="xl">
        <ApartmentDetails apartment={apartment} />
      </Container>
    </Layout>
  );
};

export default ApartmentDetailsPage;
