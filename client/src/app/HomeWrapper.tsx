"use client";

import Navbar from "@/app/(components)/Navbar";
import StoreProvider, { useAppSelector } from "@/redux/store";
import { useEffect } from "react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
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
    <div
      className={`${isDarkMode ? "dark" : ""}flex bg-gray-50 text-gray-900  dark:bg-gray-900 dark:text-gray-50 w-full `}
    >
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 dark:bg-gray-900 `}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default function HomeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <HomeLayout>{children}</HomeLayout>
    </StoreProvider>
  );
}
