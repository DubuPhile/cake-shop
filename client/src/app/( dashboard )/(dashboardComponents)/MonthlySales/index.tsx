"use client";

import { useGetDashboardStatsQuery } from "@/redux/features/dashboardSlice";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function MonthlySales() {
  const { data } = useGetDashboardStatsQuery();
  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-3 md:p-5 flex flex-col justify-center">
      <h2 className=" text-[8px] sm:text-lg">Monthly Sales</h2>
      <div className="flex items-center flex-wrap ">
        <h4 className="sm:pl-1 font-bold text-[10px] sm:text-2xl">
          {new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(data?.monthlySales || 0)}
        </h4>
        {data?.salesGrowth && (
          <span
            className={`text-[10px] sm:text-sm ${data?.salesGrowth >= 0 ? "text-green-500" : "text-red-500"} flex items-center sm:ml-2`}
          >
            {data?.salesGrowth! >= 0 ? (
              <TrendingUp className="w-3 md:w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-3 md:w-4 h-4 mr-1" />
            )}
            {Math.abs(data?.salesGrowth)}%
          </span>
        )}
      </div>
    </div>
  );
}
