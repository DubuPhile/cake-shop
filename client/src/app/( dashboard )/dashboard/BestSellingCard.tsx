"use client";
import Spinner from "@/app/(components)/Spinner";
import { formatAmountPHP } from "@/lib/utilsFunction";
import { useGetBestSellingProductQuery } from "@/redux/features/product";

export default function BestSellingCard() {
  const { data: cakes, isLoading } = useGetBestSellingProductQuery({ take: 4 });

  const maxSold = Math.max(
    ...(cakes?.map((item) => item.totalQuantity) ?? [0]),
  );

  return (
    <div className="h-80 bg-gray-100 dark:bg-gray-700 rounded-2xl p-2 md:p-5 shadow">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Spinner />
        </div>
      ) : (
        <>
          <header className="flex items-center justify-between mb-2 border-b border-gray-200 dark:border-gray-800 py-1 px-2">
            <h2 className="text-lg font-semibold">Best Selling Cakes</h2>

            <button className="text-xs md:text-sm text-gray-500 hover:text-orange-500 transition">
              View all →
            </button>
          </header>
          <div className="h-61 w-full overflow-y-auto">
            <div className="space-y-4">
              {cakes?.map((cake) => (
                <div key={cake.productId} className="flex items-center gap-4">
                  {/* Image */}
                  <div className="w-12 h-12 overflow-hidden rounded-lg">
                    <img
                      src={cake.productImage.url}
                      alt={cake.productName}
                      className=" object-cover w-full rounded-lg"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{cake.productName}</h3>

                      <span className="text-sm text-gray-500">
                        Sold {cake.totalQuantity}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-orange-500"
                        style={{
                          width: `${(cake.totalQuantity / maxSold) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* SubTotal */}
                  <div className="font-semibold whitespace-nowrap w-13 flex justify-end">
                    {formatAmountPHP(cake.subTotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
