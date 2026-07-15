"use client";

import { useGetLatestStatsQuery } from "@/redux/features/dashboardSlice";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function MonthlyOrders() {
  const { data } = useGetLatestStatsQuery();
  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-3 md:p-5 flex flex-col justify-center shadow">
      <h2 className=" text-xs sm:text-lg">Monthly Orders</h2>
      <div className="flex items-center">
        <h4 className="pl-1 font-extrabold text-[12px] sm:text-2xl">
          {data?.stats.totalOrders}
        </h4>
        {data?.stats.ordersGrowth && (
          <span
            className={`text-[10px] sm:text-sm ${data?.stats.ordersGrowth >= 0 ? "text-green-500" : "text-red-500"} flex items-center ml-2`}
          >
            {data?.stats.ordersGrowth! >= 0 ? (
              <TrendingUp className="w-3 md:w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-3 md:w-4 h-4 mr-1" />
            )}
            {Math.abs(data?.stats.ordersGrowth)}%
          </span>
        )}
      </div>
    </div>
  );
}
