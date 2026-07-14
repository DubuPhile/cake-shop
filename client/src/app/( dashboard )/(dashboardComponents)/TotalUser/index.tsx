"use client";

import { useGetDashboardStatsQuery } from "@/redux/features/dashboardSlice";
import { TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function TotalUser() {
  const { data } = useGetDashboardStatsQuery();

  return (
    <Link
      href={"/dashboard/users"}
      className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-3 md:p-5 flex flex-col justify-center"
    >
      <h2 className=" text-[8px] sm:text-lg">Users</h2>
      <div className="flex items-center">
        <h4 className="pl-1 font-extrabold text-[10px] sm:text-2xl">
          {data?.totalUsers}
        </h4>
        {data?.userGrowthPercentage && (
          <span
            className={`text-[10px] sm:text-sm ${data?.userGrowthPercentage >= 0 ? "text-green-500" : "text-red-500"} flex items-center ml-2`}
          >
            {data?.userGrowthPercentage! >= 0 ? (
              <TrendingUp className="w-3 md:w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-3 md:w-4 h-4 mr-1" />
            )}
            {Math.abs(data?.userGrowthPercentage)}%
          </span>
        )}
      </div>
    </Link>
  );
}
