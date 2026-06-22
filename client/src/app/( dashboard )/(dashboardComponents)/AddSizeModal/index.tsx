import { ProductSize, useAddSizeMutation } from "@/redux/features/product";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import { X } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  id: string;
  onClose: () => void;
  isOpen: boolean;
};

export default function AddSizeModal({ id, onClose, isOpen }: Props) {
  const [sizes, setSizes] = useState<ProductSize>({
    size: "",
    price: 0,
    stock: 0,
  });
  const [show, setShow] = useState(false);
  const [addSize] = useAddSizeMutation();

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setShow(true);
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    const timer = setTimeout(() => {
      onClose();
    }, 500);
  };
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const result = await addSize({
        productId: id,
        size: sizes.size,
        price: sizes.price,
        stock: sizes.stock,
      }).unwrap();

      toast.success("Add size Successfully", {
        style: {
          fontWeight: "600",
          color: "green",
        },
      });
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error("Add size failed", {
        style: {
          fontWeight: "600",
          color: "red",
        },
      });
    }
  };
  return (
    <>
      <div
        className={`fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center h-full w-full z-50 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}
      >
        <div
          className={`relative my-10 w-70 md:w-100 shadow-lg rounded-md bg-white dark:bg-gray-800 h-auto overflow-y-auto transition-all duration-300 ${
            show
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-95 translate-y-4 opacity-0"
          }`}
        >
          <div className="bg-gray-100 dark:bg-gray-700 rounded-t-md py-4 px-4 drop-shadow-lg">
            <Header name={`Add Size`} />
            <button
              onClick={handleClose}
              className="absolute top-0 right-0 mx-4 my-4 cursor-pointer rounded-full"
            >
              <X className="w-4 h-4 md:w-7 md:h-7 text-gray-800 hover:bg-red-400 rounded-full" />
            </button>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 gap-2 mb-2 font-semibold text-xs md:text-base mt-5">
                <h3 className="w-full flex justify-center">Sizes</h3>
                <h3 className="w-full flex justify-center">Prices</h3>
                <h3 className="w-full flex justify-center">Stock</h3>
              </div>

              <div
                key="addSize"
                className="grid grid-cols-3 gap-2 mb-2 text-xs md:text-base"
              >
                <input
                  id={`size`}
                  type="text"
                  placeholder="Size"
                  value={sizes.size}
                  onChange={(e) =>
                    setSizes((prev) => ({
                      ...prev,
                      size: e.target.value,
                    }))
                  }
                  className="flex w-full justify-center p-2 rounded-lg border border-gray-400 text-center"
                />

                <input
                  id={`price`}
                  type="number"
                  placeholder="Price"
                  value={sizes.price.toFixed(2)}
                  onChange={(e) =>
                    setSizes((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                  className="border pl-3 rounded-lg border-gray-400 text-center"
                />

                <input
                  id="stock"
                  type="number"
                  placeholder="Stock"
                  value={sizes.stock}
                  onChange={(e) =>
                    setSizes((prev) => ({
                      ...prev,
                      stock: Number(e.target.value),
                    }))
                  }
                  className="border pl-3 rounded-lg border-gray-400 text-center"
                />
              </div>
              <div className="w-full flex justify-center py-2 gap-2 mt-5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex justify-center gap-1 px-2 py-1 items-center rounded-lg  bg-gray-300 hover:bg-gray-400 active:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-800 dark:active:bg-gray-900 cursor-pointer text-xs md:text-base font-semibold shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="shadow-sm text-xs md:text-base bg-green-300 hover:bg-green-400 active:bg-green-500 dark:bg-green-600 dark:hover:bg-green-700 dark:active:bg-green-900 px-3 py-2 rounded-lg font-semibold cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
