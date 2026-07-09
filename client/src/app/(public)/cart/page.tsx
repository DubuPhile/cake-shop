"use client";
import CartItem from "@/app/(components)/CartItem/Index";
import { calculateTotalPrice } from "@/lib/utils";
import {
  MyCart,
  useDeleteCartMutation,
  useGetCartQuery,
} from "@/redux/features/cartSlice";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Carts() {
  const { data: myCart } = useGetCartQuery();
  const [checkItems, setCheckItems] = useState<MyCart[] | []>([]);
  const [deleteCart] = useDeleteCartMutation();

  const handleCheckboxChange = (checked: boolean, item: MyCart) => {
    if (checked) {
      setCheckItems((prev) => [...prev, item]);
    } else {
      setCheckItems((prev) =>
        prev.filter((cartItem) => cartItem.id !== item.id),
      );
    }
  };

  const items_per_page = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const cart = myCart ?? [];

  const totalPages = Math.ceil(cart.length / items_per_page);

  const startIndex = (currentPage - 1) * items_per_page;

  const currentItems = cart.slice(startIndex, startIndex + items_per_page);

  const handleDeleteCart = async (cartId: string) => {
    try {
      await deleteCart(cartId).unwrap();

      if (currentItems.length === 1) {
        setCurrentPage((prev) => prev - 1);
      }

      toast.success("Delete Success", {
        style: {
          fontWeight: "600",
          color: "green",
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full max-w-7xl ">
      <div className=" min-h-[75vh]">
        <div className="grid grid-cols-7 gap-2 px-2 py-2 font-bold">
          <div className="col-span-3 text-lg ">Product</div>
          <div className="col-span-1 text-center ">Unit Price</div>
          <div className="col-span-1 text-center ">Quantity</div>
          <div className="col-span-1 text-center ">Total</div>
          <div className="col-span-1 text-center ">Action</div>
        </div>
        {currentItems?.map((item) => (
          <div key={item.id}>
            <CartItem
              item={item}
              checkItems={checkItems}
              handleDeleteCart={handleDeleteCart}
              handleCheckboxChange={handleCheckboxChange}
            />
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6 text-[10px] md:text-base">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className=" px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1 ? "bg-red-300 text-white" : "border"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      <div className="my-2 py-2 flex justify-end items-center gap-2 pr-10">
        <span className="font-semibold">
          {`Total (${checkItems.length} ${checkItems.length > 1 ? "items" : "item"}):`}
        </span>
        <h3 className="text-lg font-bold text-red-500">
          {new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(calculateTotalPrice(checkItems))}
        </h3>
        <button className="flex gap-2 bg-red-300 px-4 py-2 rounded-lg text-gray-800 font-bold hover:bg-red-400 -translate-y-0.5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] active:bg-red-300 active:translate-y-0 active:drop-shadow-none text-sm md:text-lg cursor-pointer">
          Checkout
        </button>
      </div>
    </div>
  );
}
