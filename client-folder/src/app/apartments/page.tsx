import ApartmentListingCard from "@components/apartment-listing-card";
import ApartmentFiltersSidebar from "@components/filter-sidebar";
import Layout from "@components/layout";
import Searchbar from "@components/search-bar";
import { Container, Group } from "@mantine/core";
import { IGetAllReponse, ApartmentListingDto } from "@server";
import apiRequest from "@utils/axios";

const ApartmentListingsPage = async () => {
  const { data, error } = await apiRequest<IGetAllReponse<ApartmentListingDto>>(
    {
      method: "GET",
      url: "apartments/listings",
    }
  );
  return (
    <Layout className="flex">
      <div className="hidden w-[300px] h-1/4 2xl:flex bg-red-500" />
      <Container size="md" mt={"xl"} className="flex flex-col gap-8">
        <Group wrap="nowrap">
          <ApartmentFiltersSidebar />
          <Searchbar />
        </Group>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {data?.data.map((a) => (
            <ApartmentListingCard apartment={a} key={a._id} />
          ))}
        </div>
      </Container>
    </Layout>
  );
};

export default ApartmentListingsPage;
