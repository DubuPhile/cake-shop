"use client";

import { useGetLowStockQuery } from "@/redux/features/product";
import Link from "next/link";

export default function LowStockCard() {
  const { data: stock } = useGetLowStockQuery({ take: 4 });
  return (
    <div className="h-80 bg-gray-100 dark:bg-gray-700 rounded-2xl p-2 md:p-5 shadow ">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 py-1 px-2">
        <h2 className="text-lg font-semibold">Low Stock Alert</h2>

        <Link
          href={"/dashboard/inventory"}
          className="text-xs md:text-sm text-gray-500 hover:text-orange-500 dark:hover:text-white transition"
        >
          View all →
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700 h-65 overflow-y-auto">
        {stock?.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
          >
            {/* Left */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={product.image.url}
                alt={product.productName}
                className="h-12 w-12 rounded-lg object-cover md:h-12 md:w-12"
              />

              <div className="min-w-0">
                <h3 className="truncate text-xs md:text-sm font-medium">
                  {product.productName}
                </h3>

                <p className="text-xs text-gray-500">
                  Size:{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {product.size}
                  </span>
                </p>

                <p className="text-xs md:text-sm text-red-500">
                  Stock: {product.stock}
                </p>
              </div>
            </div>

            {/* Right */}
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
              Low
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
