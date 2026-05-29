"use client";

import Header from "@/app/( dashboard )/(dashboardComponents)/Header";
import { CircleX } from "lucide-react";
import React, { useState } from "react";
import MultiImageUpload from "./MultiImageUpload";
import Sizes from "./Sizes";

export type Sizes = {
  size: string;
  price: string;
};

type form = {
  prodName: string;
  description: string;
};

export default function CreateProductModal() {
  const [images, setImages] = useState<string[]>([]);

  const [form, setForm] = useState<form>({
    prodName: "",
    description: "",
  });

  const [sizes, setSizes] = useState<Sizes[]>([
    {
      size: "",
      price: "",
    },
  ]);
  const [category, setCategory] = useState<string>("");
  const [othercategory, setOtherCategory] = useState<boolean>(false);

  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.target.value === "others"
      ? (setOtherCategory(true), setCategory(""))
      : (setCategory(e.target.value), setOtherCategory(false));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const labelCSS =
    "block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 font-semibold";
  const inputCSS =
    "block w-[80%] md:w-full max-w-75 mb-2 p-2 border-gray-400 border rounded-md text-xs md:text-base";
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center h-full w-full z-50">
      <div className="relative my-10 w-[90%] shadow-lg rounded-md bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="bg-gray-100 rounded-t-md py-3 px-3 drop-shadow-lg">
          <Header name={"Create New Product"} />
          <button
            //onClick={onClose}
            className="absolute top-0 right-0 mx-4 my-4 cursor-pointer rounded-full"
          >
            <CircleX className="w-4 h-4 md:w-7 md:h-7 text-gray-800 hover:bg-red-400 rounded-full" />
          </button>
        </div>
        <div className="flex justify-center m-2">
          <form className="relative m-5 w-full max-w-200">
            <div className="md:flex justify-between gap-2">
              <div>
                <label htmlFor="prodName" className={labelCSS}>
                  Product Name
                </label>
                <input
                  id="prodName"
                  type="text"
                  name="prodName"
                  autoComplete="off"
                  placeholder="Name"
                  onChange={(e) => handleChange(e)}
                  value={form.prodName}
                  className={inputCSS}
                  required
                />

                <label htmlFor="description" className={labelCSS}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  autoComplete="off"
                  placeholder="Product description..."
                  onChange={handleChange}
                  value={form.description}
                  className="w-[80%] h-25 md:w-75  lg:w-100 md:h-50 p-3 resize-none border rounded-lg border-gray-400 text-xs md:text-base"
                  required
                />
                <div className="flex gap-3 my-2 items-center">
                  <label htmlFor="category" className={labelCSS}>
                    Category
                  </label>
                  <select
                    id="category"
                    value={othercategory ? "others" : category}
                    onChange={handleCategory}
                    className="bg-gray-200 hover:bg-gray-300 px-2 py-2 rounded-lg font-semibold text-gray-700"
                  >
                    <option className="font-semibold text-gray-700" value="">
                      Select
                    </option>
                    <option
                      className="font-semibold text-gray-700"
                      value="cakes"
                    >
                      Cakes
                    </option>
                    <option
                      className="font-semibold text-gray-700"
                      value="desserts"
                    >
                      Desserts
                    </option>
                    <option
                      className="font-semibold text-gray-700"
                      value="others"
                    >
                      Others
                    </option>
                  </select>
                  {othercategory ? (
                    <input
                      id="category"
                      type="text"
                      autoComplete="off"
                      placeholder="others"
                      onChange={(e) => setCategory(e.target.value)}
                      value={category}
                      className="w-35 px-2 py-2 rounded-lg border border-gray-400"
                    />
                  ) : (
                    ""
                  )}
                </div>

                <Sizes sizes={sizes} setSizes={setSizes} />
              </div>
              <div className="my-2 md:mt-20 ">
                <MultiImageUpload setImages={setImages} images={images} />
              </div>
            </div>
            <button
              type="submit"
              className="relative my-2 md:absolute top-0 right-0 bg-green-300 hover:bg-green-400 active:bg-green-500 px-4 py-2 rounded-2xl text-xs md:text-sm font-semibold drop-shadow-lg cursor-pointer text-gray-700"
            >
              Create Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
