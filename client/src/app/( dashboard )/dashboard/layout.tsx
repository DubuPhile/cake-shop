import RequiredAuth from "@/app/(components)/RequiredAuth";
import { Metadata } from "next";
import DashboardWrapper from "./DashboardWrapper";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Metrics",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequiredAuth allowedRoles={["ADMIN"]}>
      <main className="w-full">
        <DashboardWrapper>{children}</DashboardWrapper>
      </main>
    </RequiredAuth>
  );
}
