"use client";

import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/( dashboard )/(dashboardComponents)/Header";
import {
  useCreateProductMutation,
  useGetAllProductsQuery,
} from "@/redux/features/product";
import SearchInput from "@/app/(components)/SearchInput";
import Link from "next/link";
import { useDebounce } from "@/hook/useDebounce";
import Spinner from "@/app/(components)/Spinner";
import Rating from "@/app/(components)/Rating";
import CreateProductModal from "../../(dashboardComponents)/CreateProductModal";
import ProductOption from "../../(dashboardComponents)/ProductOption";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<Boolean>(false);
  const [category, setCategory] = useState<string>("");
  const debounceSearch = useDebounce({ value: searchTerm, delay: 300 });

  const [createProduct] = useCreateProductMutation();
  const {
    data: products,
    isLoading,
    isError,
  } = useGetAllProductsQuery({ search: debounceSearch, category: category });

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4 min-h-screen">
        Failed to fetch products
      </div>
    );
  }

  const handleCreateProduct = async (productData: FormData) => {
    await createProduct(productData);
  };

  return (
    <main className="mx-auto pb-10 w-full h-[85vh] min-h-[85vh] ">
      {/* Header bar */}
      <div className="flex justify-between items-center">
        <Header name="Products" />
        <button
          className="flex items-center my-3 bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 text-gray-200!" />
          Create Product
        </button>
      </div>
      <div className="flex gap-5 items-center">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search Product..."
          className="max-w-100"
        />

        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="appearance-none rounded px-3 py-0 h-10 text-gray-50 bg-blue-400 font-semibold drop-shadow-sm my-3 hover:bg-blue-500"
        >
          <option className="font-semibold " value="">
            All Categories
          </option>
          <option className="font-semibold" value="cakes">
            Cake
          </option>
          <option className="font-semibold" value="desserts">
            Desserts
          </option>
          <option className="font-semibold" value="birthday cakes">
            Birthday Cake
          </option>
        </select>
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {isLoading ? (
          <Spinner />
        ) : (
          products?.map((product) => (
            <div
              key={product.id}
              className={`relative border border-gray-200 dark:border-gray-700 shadow rounded-md p-4 max-w-full w-full mx-auto `}
            >
              <Link
                href={`/dashboard/products/${product.id}`}
                className="flex flex-col items-center"
              >
                <img
                  src={product.image.find((img) => img.isPrimary)?.url}
                  alt={product.name}
                  className="h-40 object-cover"
                />
                <h3 className="text-lg text-gray-900 dark:text-gray-50 font-semibold ">
                  {product.name}
                </h3>
                <p className="text-gray-800 dark:text-gray-100">
                  ${product.sizes[0].price.toFixed(2)}
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Stock: {product.sizes[0].stock}
                </div>
                <div className="flex items-center mt-2">
                  <Rating rating={product.rating} />
                </div>
              </Link>
              <ProductOption productId={product.id} />
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <CreateProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateProduct}
        />
      )}
    </main>
  );
}
