import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

const Searchbar = () => {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Search by name, project, unit number or developer..."
        size={"md"}
        //   value={searchTerm}
        //   onChange={handleSearch}
        leftSection={<IconSearch />}
      />
    </div>
  );
};

export default Searchbar;
