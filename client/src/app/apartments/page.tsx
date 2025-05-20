import ApartmentListingCard from "@components/apartment-listing-card";
import ApartmentFiltersSidebar from "@components/filter-sidebar";
import Layout from "@components/layout";
import Searchbar from "@components/search-bar";
import { Center, Container, Group } from "@mantine/core";
import apiRequest from "@utils/axios";
import { IGetAllReponse, IListing } from "@ctypes";
export const dynamic = "force-dynamic";
const ApartmentListingsPage = async () => {
  const { data, error } = await apiRequest<IGetAllReponse<IListing>>({
    method: "GET",
    url: "apartments/listings",
  });
  console.log(error);
  return (
    <Layout className="flex">
      <div className="hidden w-[300px] h-1/4 2xl:flex bg-red-500" />
      <Container size="md" mt={"xl"} className="flex flex-col gap-8">
        <Group wrap="nowrap">
          <ApartmentFiltersSidebar />
          <Searchbar />
        </Group>

        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {data?.data.map((a) => (
              <ApartmentListingCard apartment={a} key={a._id} />
            ))}
          </div>
        ) : (
          <Center>No results found</Center>
        )}
      </Container>
    </Layout>
  );
};

export default ApartmentListingsPage;
