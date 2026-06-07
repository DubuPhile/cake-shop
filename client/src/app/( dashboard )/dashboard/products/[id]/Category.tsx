import { Products } from "@/redux/features/product";
import React, { useState } from "react";

type props = {
  category: string;
  setForm: React.Dispatch<React.SetStateAction<Products>>;
  disabled: boolean;
};

export default function Category({ category, setForm, disabled }: props) {
  const [otherCategory, setOtherCategory] = useState<boolean>(false);
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
        className={`group px-2 py-2 rounded-lg font-semibold  ${disabled ? "bg-[#0000002c] hover:bg-gray-300 dark:hover:bg-gray-700 appearance-auto" : "bg-none appearance-none"}`}
        required
      >
        <option
          className="font-semibold text-gray-700 dark:group-hover:text-gray-50"
          value=""
        >
          Select
        </option>
        <option
          className="font-semibold text-gray-700 dark:group-hover:text-gray-50"
          value="cakes"
        >
          Cakes
        </option>
        <option
          className="font-semibold text-gray-700 dark:group-hover:text-gray-50"
          value="desserts"
        >
          Desserts
        </option>
        <option
          className="font-semibold text-gray-700 dark:group-hover:text-gray-50"
          value="others"
        >
          Others
        </option>
      </select>
      {otherCategory ? (
        <input
          id="category"
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
