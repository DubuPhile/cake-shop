"use client";
import TotalUser from "../(dashboardComponents)/TotalUser";
import MonthlyOrders from "../(dashboardComponents)/MonthlyOrders";
import MonthlySales from "../(dashboardComponents)/MonthlySales";
import SalesSummaryCard from "./SalesSummaryCard";
import { useGetBestSellingProductQuery } from "@/redux/features/product";
import BestSellingCard from "./BestSellingCard";
import OrderStatusCard from "./OrderStatusCard";
import RecentOrders from "./RecentOrders";

export default function Dashboard() {
  const { data } = useGetBestSellingProductQuery();
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 ">
        <div className="grid grid-cols-3 gap-2 md:gap-4 ">
          <TotalUser />
          <MonthlyOrders />
          <MonthlySales />
          <SalesSummaryCard />
        </div>
        <RecentOrders />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
        <OrderStatusCard />
        <BestSellingCard />
        <h4 className="bg-yellow-500 h-80">helll</h4>
      </div>
    </div>
  );
}
