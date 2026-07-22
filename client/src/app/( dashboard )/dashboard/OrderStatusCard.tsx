"use client";

import { useGetCountByStatusQuery } from "@/redux/features/orderSlice";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function OrderStatusCard() {
  const { data } = useGetCountByStatusQuery();
  const total = data?.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="h-80 bg-gray-100 dark:bg-gray-700 rounded-2xl p-2 md:p-5 shadow">
      <h2 className="font-semibold text-lg mb-4">Order Status</h2>

      <div className="flex items-center justify-center">
        {/* Chart */}
        <div className="w-48 h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={2}
                stroke="none"
              >
                {data?.map((entry) => (
                  <Cell key={entry.status} fill={entry.color} />
                ))}
              </Pie>

              {/* Center Text */}
              <text
                x="50%"
                y="48%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-900 dark:fill-gray-50 text-3xl font-bold"
              >
                {total}
              </text>

              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-500 text-sm"
              >
                Total
              </text>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-4">
          {data?.map((item) => (
            <div key={item.status} className="flex items-center gap-3 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />

              <span className="text-gray-600 w-15 lg:w-25 text-[10px] lg:text-sm font-semibold">
                {item.status}
              </span>

              <span className="font-medium text-[10px] lg:text-sm">
                {item.value}
              </span>

              <span className="text-gray-400 text-[10px] lg:text-sm">
                ({((item.value / (total || 0)) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
