import { Icon, IconBuilding, IconPlus } from "@tabler/icons-react";
import { create } from "zustand";

interface IRoute {
  label: string;
  href: string;
  icon: Icon;
}

export const globalRoutes: IRoute[] = [
  {
    label: "listings",
    href: "/apartments",
    icon: IconBuilding,
  },
  {
    label: "add listing",
    href: "/apartments/add",
    icon: IconPlus,
  },
];
