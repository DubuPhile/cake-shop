"use client";

import { Products, useGetProductInfoQuery } from "@/redux/features/product";
import { SquarePen } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Category from "./Category";

export default function ProductPage() {
  const { id } = useParams();
  if (!id) return;
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useGetProductInfoQuery(id?.toString());

  const [disabled, setDisabled] = useState<boolean>(false);
  const [form, setForm] = useState<Products>({
    id: "",
    name: "",
    category: "",
    description: "",
    image: [],
    sizes: [],
    averageRating: 0,
  });

  useEffect(() => {
    if (product) {
      setForm({
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        image: product.image,
        sizes: product.sizes,
        averageRating: product.averageRating,
      });
    }
  }, [product]);

  console.log(disabled);

  const content = (
    <>
      <div className="relative flex flex-col">
        <div className="flex items-center">
          <button
            onClick={() => setDisabled((prev) => !prev)}
            className="rounded-2xl hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600  dark:active:bg-gray-700 mx-1 cursor-pointer"
          >
            <SquarePen className="w-4 h-4 m-2" />
          </button>
          <input
            id="name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            autoComplete="none"
            disabled={!disabled}
            className={`text-2xl md:text-4xl font-semibold w-80 rounded-lg px-2 py-1 mr-2 ${disabled ? "bg-[#0000002c]" : "bg-none"}`}
          />
        </div>
        <div className="flex items-center mt-5">
          <button
            onClick={() => setDisabled((prev) => !prev)}
            className="rounded-2xl hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600  dark:active:bg-gray-700 mx-1 cursor-pointer"
          >
            <SquarePen className="w-4  h-4 m-2" />
          </button>
          <label htmlFor="description" className="font-semibold">
            Description:
          </label>
        </div>
        <div className="pl-10">
          <textarea
            id="description"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            autoComplete="none"
            disabled={!disabled}
            className={`px-5 py-2 w-full h-20 md:h-40 md:max-w-100 text-xs md:text-base indent-8 resize-none rounded-lg ${disabled ? "bg-[#0000002c]" : "bg-none"}`}
          />
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setDisabled((prev) => !prev)}
            className="rounded-2xl hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600  dark:active:bg-gray-700 mx-1 cursor-pointer"
          >
            <SquarePen className="w-4 h-4 m-2" />
          </button>
          <Category
            disabled={disabled}
            setForm={setForm}
            category={form.category}
          />
        </div>

        {disabled && (
          <div className="flex gap-2 p-5">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 active:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-900 px-2 py-1 rounded-2xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-green-300 hover:bg-green-400 active:bg-green-500 dark:bg-green-600 dark:hover:bg-green-700 dark:active:bg-green-900 px-2 py-1 rounded-2xl font-semibold"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </>
  );

  return content;
}
