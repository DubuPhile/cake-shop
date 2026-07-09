"use client";

import StarRating from "@/app/(components)/StarRating";
import { useGetProductInfoQuery } from "@/redux/features/product";
import { useParams, useRouter } from "next/navigation";
import ProdImages from "./ProdImages";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, ShoppingCart } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useAddToCartMutation } from "@/redux/features/cartSlice";
import toast from "react-hot-toast";

export default function Product() {
  const { slug } = useParams();
  const router = useRouter();
  const { accessToken } = useAppSelector((state) => state.auth);

  const { data: product } = useGetProductInfoQuery(slug?.toString() || "");

  const [createCart] = useAddToCartMutation();
  const [selectIndex, setSelectIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const decreaseQ = () => {
    if (quantity === 1) return;
    setQuantity(quantity - 1);
  };
  const increaseQ = () => {
    setQuantity(quantity + 1);
  };

  const selectedSize = product?.sizes?.[selectIndex];

  const addToCart = async () => {
    if (!accessToken) return router.push("/login");
    try {
      const createdCart = await createCart({
        productId: product?.id || "",
        sizeId: selectedSize?.id || "",
        quantity,
      });
      toast.success("Add To Cart", {
        style: {
          fontWeight: "600",
          color: "green",
        },
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to Add to Cart", {
        style: {
          fontWeight: "600",
          color: "red",
        },
      });
    }
  };
  const buyNow = () => {
    if (!accessToken) return router.push("/login");
  };
  if (!product) return;
  const content = (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl p-2">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="md:w-[50%] flex items-center">
            <ProdImages images={product?.images || []} />
          </div>
          <div className="md:w-[50%]">
            <h1 className="font-bold text-4xl">{product?.name}</h1>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold underline my-2">
                {product?.averageRating?.toFixed(1)}
              </span>
              <StarRating
                initialRating={Number(product?.averageRating)}
                interactive={false}
                style="w-6 h-5"
              />
            </div>
            <h4 className="text-lg md:text-2xl my-2">
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(selectedSize?.price || 0)}
            </h4>
            <h4 className="text-base md:text-2xl font-semibold my-2">
              Description:
            </h4>
            <p className="indent-5 text-xs md:text-lg">
              {product?.description}
            </p>
            <h4 className="text-base md:text-2xl font-semibold my-2">Sizes:</h4>
            <div className="flex gap-3">
              {product?.sizes?.map((size, index) => {
                return (
                  <button
                    className={`flex gap-2 bg-gray-100 px-4 py-2 rounded-md text-gray-800 font-bold hover:bg-gray-200 -translate-y-0.5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] active:bg-gray-300 active:translate-y-0 active:drop-shadow-none ${selectIndex === index ? "border border-blue-500" : "border-none"} text-sm md:text-base`}
                    onClick={() => setSelectIndex(index)}
                    key={size.id}
                  >
                    {size.size}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <h4 className="text-base md:text-xl font-semibold my-2">
                Quantity:
              </h4>
              <div className="flex items-center">
                <button
                  onClick={decreaseQ}
                  className="border px-1 py-1 rounded-full hover:bg-gray-200 active:bg-gray-300 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-2xl">{quantity}</span>
                <button
                  onClick={increaseQ}
                  className="border px-1 py-1 rounded-full hover:bg-gray-200 active:bg-gray-300 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex gap-4 mt-5">
              <button
                className="flex gap-2 bg-gray-100 px-4 py-2 rounded-2xl text-gray-800 font-bold hover:bg-gray-200 -translate-y-0.5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] active:bg-gray-300 active:translate-y-0 active:drop-shadow-none text-sm md:text-lg"
                onClick={addToCart}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                className="flex gap-2 bg-red-300 px-4 py-2 rounded-2xl text-gray-800 font-bold hover:bg-red-400 -translate-y-0.5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] active:bg-red-300 active:translate-y-0 active:drop-shadow-none text-sm md:text-lg"
                onClick={buyNow}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return content;
}
