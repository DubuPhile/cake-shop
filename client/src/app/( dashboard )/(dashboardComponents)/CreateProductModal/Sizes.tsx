import { ProductSize } from "@/redux/features/product";
import React from "react";

type sizesProps = {
  setSizes: React.Dispatch<React.SetStateAction<ProductSize[]>>;
  sizes: ProductSize[];
};

export default function Sizes({ sizes, setSizes }: sizesProps) {
  const addSize = () => {
    setSizes([...sizes, { size: "", price: 0, stock: 0 }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2 mb-2 font-semibold text-xs md:text-base text-gray-700">
        <h3 className="w-full flex justify-center">Size</h3>
        <h3 className="w-full flex justify-center">Price</h3>
        <h3 className="w-full flex justify-center">Stock</h3>
      </div>

      {sizes.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-4 gap-2 mb-2 text-xs md:text-base"
        >
          <input
            id={`size-${index}`}
            type="text"
            placeholder="S, M, L"
            value={item.size}
            onChange={(e) => {
              const updated = [...sizes];
              updated[index].size = e.target.value;
              setSizes(updated);
            }}
            className="border p-2 rounded-lg border-gray-400 "
          />

          <input
            id={`price-${index}`}
            type="number"
            placeholder="Price"
            value={item.price}
            onChange={(e) => {
              const updated = [...sizes];
              updated[index].price = Number(e.target.value);
              setSizes(updated);
            }}
            className="border p-2 rounded-lg border-gray-400 text-center pl-4"
          />

          <input
            id={`stock-${index}`}
            type="number"
            placeholder="Stock"
            value={item.stock}
            onChange={(e) => {
              const updatedSizes = [...sizes];

              updatedSizes[index] = {
                ...updatedSizes[index],
                stock: Number(e.target.value),
              };

              setSizes(updatedSizes);
            }}
            className="border pl-3 rounded-lg border-gray-400 text-center"
          />

          <button
            type="button"
            onClick={() => removeSize(index)}
            className="bg-red-300 hover:bg-red-400 active:bg-red-500 px-3 rounded-lg w-22 text-xs md:text-base text-gray-700 drop-shadow-lg font-semibold"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addSize}
        className="bg-green-300 hover:bg-green-400 active:bg-green-500 px-4 py-2 rounded-lg text-xs md:text-base text-gray-700 drop-shadow-lg font-semibold"
      >
        Add Size
      </button>
    </>
  );
}
