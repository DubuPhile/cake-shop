import SearchInput from "@/app/(components)/SearchInput";
import Spinner from "@/app/(components)/Spinner";
import StarRating from "@/app/(components)/StarRating";
import { Products } from "@/redux/features/product";
import Link from "next/link";

type Props = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  products: Products[];
};

export default function ProductSide({
  searchTerm,
  setSearchTerm,
  products,
  isLoading,
  isError,
  isFetching,
}: Props) {
  return (
    <div className="w-full">
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search Product..."
        className="max-w-100"
      />
      {isLoading || isFetching ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
          {isError ? (
            <div className="text-center text-red-500 py-4 min-h-screen">
              Failed to fetch products
            </div>
          ) : products.length === 0 ? (
            <h3>No Product shown</h3>
          ) : (
            products?.map((product) => (
              <div
                key={product.id}
                className={`relative border border-gray-200 dark:border-gray-700 shadow rounded-md p-4 max-w-full w-full mx-auto `}
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="flex flex-col items-center transition-scale duration-300 hover:scale-105"
                >
                  <img
                    src={product.images?.find((img) => img.isPrimary)?.url}
                    alt={product.name}
                    className="h-40 object-cover"
                  />
                  <h3 className="text-lg text-gray-900 dark:text-gray-50 font-semibold ">
                    {product.name}
                  </h3>
                  <p className="text-gray-800 dark:text-gray-100">
                    ${product.sizes?.[0]?.price.toFixed(2)}
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Stock: {product.sizes?.[0]?.stock}
                  </div>
                  <div className="flex items-center mt-2">
                    <StarRating
                      initialRating={Math.round(product.averageRating || 0)}
                      interactive={false}
                    />
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
