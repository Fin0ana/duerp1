import Link from "next/link";
import { MenuItem } from "primereact/menuitem";
import { TBreadcrumb } from "../types/navigations";

export const getBreadcrumbItems = (breadcrumb: TBreadcrumb[]): MenuItem[] => {
  return breadcrumb.map((item) => ({
    label: item.label,
    template: () => (
      <Link href={item.url}>
        <a className="text-primary">{item.label}</a>
      </Link>
    ),
  }));
};

export const getHomeItem = () => ({
  icon: "pi pi-home",
  template: () => (
    <Link href="/">
      <a className="text-primary"></a>
    </Link>
  ),
});

