import RequiredAuth from "@/app/(components)/RequiredAuth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Metrics",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RequiredAuth allowedRoles={["ADMIN"]}>{children}</RequiredAuth>;
}
