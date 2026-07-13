"use client";

import { useGetDashboardStatsQuery } from "@/redux/features/dashboardSlice";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function TotalUser() {
  const { data } = useGetDashboardStatsQuery();

  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-5 w-35 md:w-50">
      <h2 className=" text-xs md:text-lg">Total Users</h2>
      <div className="flex items-center">
        <h4 className="pl-1 font-extrabold text-base md:text-2xl">
          {data?.totalUsers}
        </h4>
        {data?.growthPercentage && (
          <span
            className={`text-xs ${data?.growthPercentage >= 0 ? "text-green-500" : "text-red-500"} flex items-center ml-2`}
          >
            {data?.growthPercentage! >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {Math.abs(data?.growthPercentage)}%
          </span>
        )}
      </div>
    </div>
  );
}
