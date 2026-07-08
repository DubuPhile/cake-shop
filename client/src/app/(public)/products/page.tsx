"use client";

import { useEffect, useState } from "react";
import CategorySide from "./CategorySide";
import ProductSide from "./ProductSide";
import { useDebounce } from "@/hook/useDebounce";
import {
  useGetAllProductsQuery,
  useGetMaxPriceQuery,
} from "@/redux/features/product";
import { useSearchParams } from "next/navigation";

export default function Products() {
  const { data: prodMaxPrice } = useGetMaxPriceQuery();
  const [values, setValues] = useState([0, 0]);
  const [category, setCategory] = useState<string>("");

  const searchParams = useSearchParams();
  const categoryParams = searchParams.get("category");

  useEffect(() => {
    setCategory(categoryParams ?? "");
  }, [categoryParams]);

  useEffect(() => {
    if (!prodMaxPrice?.max) return;

    setValues((prev) => {
      const next = [...prev];
      next[1] = Number(prodMaxPrice.max);
      return next;
    });
  }, [prodMaxPrice]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debounceSearch = useDebounce({ value: searchTerm, delay: 500 });
  const maxPrice = useDebounce({ value: values[1].toString(), delay: 500 });
  const minPrice = useDebounce({ value: values[0].toString(), delay: 500 });
  const {
    data: products,
    isLoading,
    isFetching,
    isError,
  } = useGetAllProductsQuery({
    search: debounceSearch,
    category: category,
    maxPrice: Number(maxPrice),
    minPrice: Number(minPrice),
  });

  if (!products) return;
  return (
    <div className="flex flex-col md:flex-row p-4 w-full h-screen">
      {/* LEFT SIDE */}
      <CategorySide
        values={values}
        setValues={setValues}
        setCategory={setCategory}
        category={category}
      />
      {/* RIGHT SIDE */}
      <ProductSide
        products={products}
        isError={isError}
        isLoading={isLoading}
        isFetching={isFetching}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}
