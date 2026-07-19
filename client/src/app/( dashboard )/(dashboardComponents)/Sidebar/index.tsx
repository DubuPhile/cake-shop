"use client";

import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setIsSidebarCollapsed } from "@/redux/state/global";
import {
  Archive,
  Clipboard,
  LayoutDashboardIcon,
  LucideIcon,
  Menu,
  PhilippinePeso,
  SlidersHorizontal,
  Tag,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import icon from "@/app/icon.png";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: Boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"} hover:text-blue-500 hover:dark:text-blue-400 hover:bg-blue-100 hover:dark:bg-blue-800 gap-3 transition-colors ${isActive ? "bg-blue-200 dark:bg-blue-700 text-white" : ""}`}
      >
        <Icon className="w-6 h-6 text-gray-700! dark:text-gray-200!" />
        <span
          className={`${isCollapsed ? "hidden" : "block"} font-medium text-gray-700 dark:text-gray-200`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const isSideBarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSideBarCollapsed));
  };

  const sidebarClassNames = `fixed flex flex-col ${isSideBarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"} bg-white dark:bg-gray-800 transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  return (
    <main
      className={sidebarClassNames}
      onMouseEnter={() => dispatch(setIsSidebarCollapsed(false))}
      onMouseLeave={() => dispatch(setIsSidebarCollapsed(true))}
    >
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${isSideBarCollapsed ? "px-3" : "px-8"}`}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={icon}
            alt="brand"
            width={40}
            height={40}
            className="w-10 h-10 object-cover rounded-full"
            priority
          />
          <span
            className={`${isSideBarCollapsed ? "hidden" : "block"} font-lobster text-transparent bg-linear-to-r from-[#510424] dark:from-[#fcf6f8] via-[#f6339a] to-[hsl(359,100%,75%)] text-md md:text-lg bg-clip-text whitespace-nowrap`}
          >
            Amiel Cake Shop
          </span>
        </Link>

        <button
          className="md:hidden px-3 py-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-blue-100 hover:dark:bg-blue-800 mr-2"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* LINKS */}
      <div className="grow mt-8">
        <SidebarLink
          href="/dashboard"
          icon={LayoutDashboardIcon}
          label="Dashboard"
          isCollapsed={isSideBarCollapsed}
        />
        <SidebarLink
          href="/dashboard/inventory"
          icon={Archive}
          label="Inventory"
          isCollapsed={isSideBarCollapsed}
        />
        <SidebarLink
          href="/dashboard/promotions"
          icon={Tag}
          label="Promos & Banners"
          isCollapsed={isSideBarCollapsed}
        />
        <SidebarLink
          href="/dashboard/products"
          icon={Clipboard}
          label="Products"
          isCollapsed={isSideBarCollapsed}
        />
        <SidebarLink
          href="/dashboard/users"
          icon={User}
          label="Users"
          isCollapsed={isSideBarCollapsed}
        />
        <SidebarLink
          href="/settings"
          icon={SlidersHorizontal}
          label="Settings"
          isCollapsed={isSideBarCollapsed}
        />
        <SidebarLink
          href="/expenses"
          icon={PhilippinePeso}
          label="Expenses"
          isCollapsed={isSideBarCollapsed}
        />
      </div>

      {/* FOOTER */}
      <div className={`${isSideBarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          &copy; 2026 Amiel Cake Shop
        </p>
      </div>
    </main>
  );
}
