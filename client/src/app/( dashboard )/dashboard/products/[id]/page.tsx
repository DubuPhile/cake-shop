"use client";

import {
  Products,
  useGetProductInfoQuery,
  useUpdateProductDetailsMutation,
} from "@/redux/features/product";
import { SquarePen } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Category from "./Category";
import Sizes from "./Sizes";

export default function ProductPage() {
  const { id } = useParams();
  if (!id) return;
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useGetProductInfoQuery(id?.toString());
  const [changeDetails] = useUpdateProductDetailsMutation();

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
        sizes: product.sizes ?? [],
        averageRating: product.averageRating,
      });
    }
  }, [product]);

  const handleChangeDetails = async () => {
    try {
      const updatedProduct = await changeDetails({
        id: form.id,
        name: form.name,
        description: form.description,
        category: form.category,
      }).unwrap();
      console.log(updatedProduct);
      refetch();
      setDisabled(false);
    } catch (err: any) {
      console.log(err);
    }
  };
  const handleCancel = () => {
    setDisabled(false);
  };

  const content = (
    <>
      <div className="relative flex flex-col">
        <div className="flex items-center">
          {!disabled && (
            <button
              onClick={() => setDisabled((prev) => !prev)}
              className="rounded-2xl hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600  dark:active:bg-gray-700 mx-1 cursor-pointer transition-all duration-300"
            >
              <SquarePen className="w-4 h-4 m-2" />
            </button>
          )}
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
            className={`text-2xl md:text-4xl font-semibold w-80 rounded-lg px-2 py-1 mr-2 transition-all duration-300 ${disabled ? "bg-white border border-gray-300 dark:bg-[#0000002c] shadow-md" : "bg-none"}`}
          />
        </div>
        <div className="flex items-center mt-5">
          {!disabled && (
            <button
              onClick={() => setDisabled((prev) => !prev)}
              className="rounded-2xl hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600  dark:active:bg-gray-700 mx-1 cursor-pointer"
            >
              <SquarePen className="w-4  h-4 m-2" />
            </button>
          )}
          <label htmlFor="description" className="font-semibold">
            Description:
          </label>
        </div>
        <div className={`${!disabled ? "pl-5" : ""}`}>
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
            className={`px-5 py-2 w-full h-20 md:h-40 md:max-w-100 text-xs md:text-base indent-8 resize-none rounded-lg transition-all duration-300 ${disabled ? "bg-white border shadow-md border-gray-300 dark:bg-[#0000002c]" : "bg-none"}`}
          />
        </div>
        <div className="flex items-center">
          {!disabled && (
            <button
              onClick={() => setDisabled((prev) => !prev)}
              className="rounded-2xl hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600  dark:active:bg-gray-700 mx-1 cursor-pointer"
            >
              <SquarePen className="w-4 h-4 m-2" />
            </button>
          )}

          <Category
            disabled={disabled}
            setForm={setForm}
            category={form.category}
          />
        </div>

        {disabled && (
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="shadow-sm bg-gray-300 hover:bg-gray-400 active:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-900 px-2 py-1 rounded-2xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleChangeDetails}
              className="shadow-sm bg-green-300 hover:bg-green-400 active:bg-green-500 dark:bg-green-600 dark:hover:bg-green-700 dark:active:bg-green-900 px-2 py-1 rounded-2xl font-semibold"
            >
              Save Changes
            </button>
          </div>
        )}
        <div className="w-100 lg:w-150 transition-all duration-300 mt-2">
          <Sizes
            sizes={form.sizes ?? []}
            setSizes={(newSizes) =>
              setForm((prev) => ({
                ...prev,
                sizes: newSizes,
              }))
            }
            onCancel={() =>
              setForm((prev) => ({
                ...prev,
                sizes: product?.sizes,
              }))
            }
          />
        </div>
      </div>
    </>
  );

  return content;
}
