import { Products, useGetCategoryQuery } from "@/redux/features/product";
import React, { Dispatch, SetStateAction, useState } from "react";

type props = {
  category: string;
  setForm: React.Dispatch<React.SetStateAction<Products>>;
  disabled: boolean;
  otherCategory: boolean;
  setOtherCategory: Dispatch<SetStateAction<boolean>>;
};

export default function Category({
  category,
  setForm,
  disabled,
  setOtherCategory,
  otherCategory,
}: props) {
  const { data: Categories } = useGetCategoryQuery();
  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.target.value === "others"
      ? (setOtherCategory(true),
        setForm((prev) => ({
          ...prev,
          category: "",
        })))
      : (setForm((prev) => ({
          ...prev,
          category: e.target.value,
        })),
        setOtherCategory(false));
  };
  return (
    <div className="flex gap-3 my-2 items-center">
      <label
        htmlFor="category"
        className="block text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-semibold"
      >
        Category:
      </label>
      <select
        id="category"
        value={otherCategory ? "others" : category}
        onChange={handleCategory}
        disabled={!disabled}
        className={`group px-2 py-2 rounded-lg font-semibold  ${disabled ? "bg-white border border-gray-300 dark:bg-[#0000002c] shadow-md appearance-auto" : "bg-none appearance-none"}`}
        required
      >
        <option className="font-semibold text-gray-700 " value="">
          Select
        </option>
        {Categories?.map((category) => {
          return (
            <option key={category} className="font-semibold" value={category}>
              {category}
            </option>
          );
        })}
        <option className="font-semibold text-gray-700" value="others">
          Others
        </option>
      </select>
      {otherCategory ? (
        <input
          id="otherCategory"
          type="text"
          autoComplete="off"
          placeholder="others"
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              category: e.target.value,
            }))
          }
          value={category}
          className="w-35 px-2 py-2 rounded-lg border border-gray-400"
          required
        />
      ) : (
        ""
      )}
    </div>
  );
}
