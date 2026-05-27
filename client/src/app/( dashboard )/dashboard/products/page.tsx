"use client";

import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/( dashboard )/(dashboardComponents)/Header";
import { useGetAllProductsQuery } from "@/redux/features/product";
import SearchInput from "@/app/(components)/SearchInput";
import Link from "next/link";
import { useDebounce } from "@/hook/useDebounce";
import Spinner from "@/app/(components)/Spinner";

type ProductFormData = {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
};

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debounceSearch = useDebounce({ value: searchTerm, delay: 300 });

  //const [createProduct] = useCreateProductMutation();
  const {
    data: products,
    isLoading,
    isError,
  } = useGetAllProductsQuery(debounceSearch);

  const [imagesLoaded, setImagesLoaded] = useState(0);

  const totalImages = products?.length || 0;
  const allImagesLoaded = totalImages > 0 && imagesLoaded === totalImages;

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4 min-h-screen">
        Failed to fetch products
      </div>
    );
  }

  // const handleCreateProduct = async (productData: ProductFormData) => {
  //   await createProduct(productData);
  // };

  return (
    <main className="mx-auto pb-10 w-full h-[85vh] min-h-[85vh] ">
      {/* Header bar */}
      <div className="flex justify-between items-center">
        <Header name="Products" />

        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 text-gray-200!" />
          Create Product
        </button>
      </div>
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search Product..."
        className="max-w-100"
      />
      {/* BODY PRODUCTS LIST */}
      {!allImagesLoaded && <Spinner />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {isLoading ? (
          <div className="py-4">Loading...</div>
        ) : (
          products?.map((product) => (
            <Link
              href={`/dashboard/products/${product.id}`}
              key={product.id}
              className={`border border-gray-200 dark:border-gray-700 shadow rounded-md p-4 max-w-full w-full mx-auto ${allImagesLoaded ? "block" : "hidden"}`}
            >
              <div className="flex flex-col items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 object-cover"
                  onLoad={() => setImagesLoaded((prev) => prev + 1)}
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
                {/* {product.rating && (
                  <div className="flex items-center mt-2">
                    <Rating rating={product.rating} />
                  </div>
                )} */}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* MODAL */}
      {/* {isModalOpen && (
        <CreateProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateProduct}
        />
      )} */}
    </main>
  );
}
