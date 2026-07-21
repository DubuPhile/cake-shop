"use client";

import Spinner from "@/app/(components)/Spinner";
import { useGetLatestStatsQuery } from "@/redux/features/dashboardSlice";
import { TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function TotalUser() {
  const { data, isLoading } = useGetLatestStatsQuery();
  return (
    <Link
      href={"/dashboard/users"}
      className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-3 flex flex-col justify-center shadow"
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <h2 className=" text-xs sm:text-lg">Users</h2>
          <div className="flex items-center">
            <h4 className="pl-1 font-extrabold text-[12px] sm:text-2xl">
              {data?.totalUsers}
            </h4>
            {data?.stats.usersGrowth && (
              <span
                className={`text-[10px] sm:text-sm ${data?.stats.usersGrowth >= 0 ? "text-green-500" : "text-red-500"} flex items-center ml-2`}
              >
                {data?.stats.usersGrowth! >= 0 ? (
                  <TrendingUp className="w-3 md:w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-3 md:w-4 h-4 mr-1" />
                )}
                {Math.abs(data?.stats.usersGrowth)}%
              </span>
            )}
          </div>
        </>
      )}
    </Link>
  );
}
