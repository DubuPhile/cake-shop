import { Metadata } from "next";
import TotalUser from "../(dashboardComponents)/TotalUser";
import PendingOrders from "../(dashboardComponents)/PendingOrders";
import MonthlySales from "../(dashboardComponents)/MonthlySales";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Metrics",
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <TotalUser />
        <PendingOrders />
        <MonthlySales />
      </div>
    </div>
  );
}
