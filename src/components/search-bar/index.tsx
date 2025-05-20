"use client";
import { Input } from "@mantine/core";
import { IconLoader2, IconSearch } from "@tabler/icons-react";
import apiRequest from "@utils/axios";
import { debounce, sleep } from "@utils/index";
import { useState } from "react";
const Searchbar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLoading) setIsLoading(true);
    const searchTerm = e.target.value;
    if (!searchTerm) return;
    const { data, error } = await apiRequest<[]>({
      method: "POST",
      url: "/apartments/search",
      data: {
        text: e.target.value,
      },
    });
    setIsLoading(false);
    if (error) {
      console.log(error);
      return;
    }
    if (process.env.NEXT_PUBLIC_NODE_ENV === "development") await sleep(1000); // simulate latency
    return data;
  };
  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Search by name, project, unit number or developer..."
        size={"md"}
        //   value={searchTerm}
        onChange={debounce(handleSearch, 500)}
        leftSection={
          isLoading ? <IconLoader2 className="animate-spin" /> : <IconSearch />
        }
        disabled={isLoading}
      />
    </div>
  );
};

export default Searchbar;
