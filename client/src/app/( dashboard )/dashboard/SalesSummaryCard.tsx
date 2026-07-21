"use client";
import Spinner from "@/app/(components)/Spinner";
import { formatAmountPHP } from "@/lib/utilsFunction";
import { useGetMonthlyStatsQuery } from "@/redux/features/dashboardSlice";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

export default function SalesSummaryCard() {
  const { data, isLoading } = useGetMonthlyStatsQuery();

  const salesData = data
    ? [...data].sort((a, b) => (a.month ?? 0) - (b.month ?? 0))
    : [];

  const chartData = salesData.map((item) => ({
    date: new Date(item.year ?? 0, (item.month ?? 1) - 1).toLocaleString(
      "default",
      {
        month: "short",
        year: "numeric",
      },
    ),
    sales: item.totalSales,
    salesGrowth: item.salesGrowth,
  }));

  const totalValueSum =
    chartData.reduce((accu, current) => accu + current.sales, 0) || 0;

  const highestValueData = chartData.reduce((accu, current) => {
    return accu.sales > current.sales ? accu : current;
  }, chartData[0] || {});

  const highestValueDate = highestValueData.date
    ? new Date(highestValueData.date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      })
    : "N/A";

  const result =
    chartData?.reduce((accu, current, _, array) => {
      return accu + current.salesGrowth / array.length;
    }, 0) || 0;

  const colors = ["#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

  return (
    <div className="col-span-3 bg-gray-100 dark:bg-gray-700 rounded-2xl px-2 py-1 md:px-5 md:py-1 shadow h-110">
      {isLoading ? (
        <div className="h-87.5">
          <Spinner />
        </div>
      ) : (
        <>
          <header>
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold mb-3 px-4 md:px-7 pt-5">
                Sales Summary
              </h2>
              <div className="flex items-end mb-3">
                <h4 className="font-bold text-sm md:text-base">
                  Monthly Sales
                </h4>
              </div>
            </div>
            <hr className="text-gray-300 dark:text-gray-600" />
          </header>
          <main>
            <div className="flex justify-between items-center mb-6 px-4 md:px-7">
              <div className="text-lg font-medium">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Value
                </p>
                <div className="flex flex-row items-center">
                  <span className=" text-md md:text-2xl font-extrabold">
                    {formatAmountPHP(totalValueSum, 2)}
                  </span>
                  <span
                    className={`flex flex-row ${result >= 0 ? "text-green-500" : "text-red-500"} text-xs md:text-sm ml-2`}
                  >
                    {result >= 0 ? (
                      <TrendingUp className="w-3 md:w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 md:w-4 h-4 mr-1" />
                    )}
                    {result.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            {/* CHARTS */}
            <ResponsiveContainer
              width="99%"
              height={250}
              className="px-4 md:px-7"
            >
              <BarChart
                data={chartData}
                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis
                  tickFormatter={(value) => {
                    return `${new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                      maximumFractionDigits: 0,
                    }).format(value / 1000)}k`;
                  }}
                  tick={{ fontSize: 12, dx: -1 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value) => {
                    if (typeof value === "number") {
                      return [`$${value.toLocaleString("en")}`];
                    }
                    return [value ?? ""];
                  }}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                />
                <Bar dataKey="sales" barSize={30} radius={[10, 10, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </main>
          {/* FOOTER */}
          <footer>
            <hr className="text-gray-300 dark:text-gray-600" />
            <div className="flex justify-between items-center mt-6 text-sm px-4 md:px-7 mb-4">
              <p>{salesData.length || 0} months</p>
              <p className="text-sm">
                highest Sales Date:{" "}
                <span className="font-bold">{highestValueDate}</span>
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
