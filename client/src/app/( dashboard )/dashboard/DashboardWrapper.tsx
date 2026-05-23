"use client";

import Navbar from "@/app/( dashboard )/(dashboardComponents)/NavbarDashboard";
import Sidebar from "@/app/( dashboard )/(dashboardComponents)/Sidebar";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSideBarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className={`${isDarkMode ? "dark" : ""}flex w-full `}>
      <Sidebar />
      <main
        className={`flex flex-col w-full h-full py-7 px-2 sm:px-9  ${isSideBarCollapsed ? "md:pl-24" : "md:pl-72"}`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
