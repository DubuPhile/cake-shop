"use client";

import { useGetDashboardStatsQuery } from "@/redux/features/dashboardSlice";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function PendingOrders() {
  const { data } = useGetDashboardStatsQuery();
  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-3 md:p-5 flex flex-col justify-center">
      <h2 className=" text-[8px] sm:text-lg">Orders</h2>
      <div className="flex items-center">
        <h4 className="pl-1 font-extrabold text-[10px] sm:text-2xl">
          {data?.totalOrders}
        </h4>
        {data?.ordersGrowthPercentage && (
          <span
            className={`text-[10px] sm:text-sm ${data?.ordersGrowthPercentage >= 0 ? "text-green-500" : "text-red-500"} flex items-center ml-2`}
          >
            {data?.ordersGrowthPercentage! >= 0 ? (
              <TrendingUp className="w-3 md:w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-3 md:w-4 h-4 mr-1" />
            )}
            {Math.abs(data?.ordersGrowthPercentage)}%
          </span>
        )}
      </div>
    </div>
  );
}
