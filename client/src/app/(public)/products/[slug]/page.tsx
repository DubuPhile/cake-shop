"use client";

import StarRating from "@/app/(components)/StarRating";
import { useGetProductInfoQuery } from "@/redux/features/product";
import { useParams } from "next/navigation";

export default function Product() {
  const { slug } = useParams();
  const { data: product } = useGetProductInfoQuery(slug?.toString() || "");
  console.log(product);
  if (!product) return;
  const content = (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl p-2">
        <h1 className="font-bold text-4xl">{product?.name}</h1>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold underline">
            {product?.averageRating}
          </span>
          <StarRating
            initialRating={Number(product?.averageRating)}
            interactive={false}
            style="w-6 h-5"
          />
        </div>
      </div>
    </div>
  );
  return content;
}
