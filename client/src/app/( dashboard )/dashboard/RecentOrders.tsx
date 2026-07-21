"use client";

import Spinner from "@/app/(components)/Spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatAmountPHP } from "@/lib/utilsFunction";
import { Status, useGetRecentOrdersQuery } from "@/redux/features/orderSlice";
import { EllipsisVertical } from "lucide-react";

export default function RecentOrders() {
  const {
    data: orders,
    isLoading,
    isError,
  } = useGetRecentOrdersQuery({ take: 8 });
  const statusColor: Record<Status, string> = {
    PENDING: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
    PAID: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    PROCESSING:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    READY:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    COMPLETED:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-2 md:p-5 shadow h-120 sm:h-140">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center w-full h-full">
          <h2 className="text-red-500">Error Fetching Data</h2>
        </div>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Orders</h2>

            <button className="text-sm text-gray-500 hover:text-pink-600">
              View all
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className=" text-left text-[10px] md:text-sm text-gray-500">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-center">Total</th>
                  <th className="pb-3 text-center">Date</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>

              <tbody>
                {orders?.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 text-[11px] sm:text-base"
                  >
                    <td className="py-4 font-medium">
                      <div className="truncate w-15 sm:w-33">
                        #{order.orderId}
                      </div>
                    </td>

                    <td>{order.customer}</td>

                    <td className="text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-[8px] sm:text-sm font-medium ${
                          statusColor[order.status as keyof typeof statusColor]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="text-center">
                      {formatAmountPHP(order.total)}
                    </td>

                    <td className="text-center">
                      {new Date(order.date).toLocaleDateString("en-PH", {
                        year: "2-digit",
                        month: "numeric",
                        day: "numeric",
                      })}
                    </td>

                    <td className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <div className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                            <EllipsisVertical className="h-4 w-4" />
                          </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="bg-white  ring-0 shadow-lg"
                        >
                          <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
                            Copy Order ID
                          </DropdownMenuItem>

                          {!["PAID", "READY", "COMPLETED"].includes(
                            order.status,
                          ) && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500">
                                Cancel Order
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
