"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

export type Product = {
  id: number;
  image: StaticImageData;
  name: string;
  price: number;
};

type SliderProps = {
  products: Product[];
};

export default function ProductSlider({ products }: SliderProps) {
  const [current, setCurrent] = useState(0);

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [products.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-87.5 overflow-hidden rounded-2xl shadow-lg mx-auto">
      {/* Slider */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            id={product.id.toString()}
            className="min-w-full bg-white"
          >
            <Image
              src={product.image}
              alt={product.name}
              className="w-full h-62.5 object-cover"
            />

            <div className="p-4">
              <h2 className="text-xl font-bold">{product.name}</h2>

              <p className="text-gray-500">₱{product.price}</p>

              <button className="mt-4 w-full bg-black text-white py-3 rounded-xl">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full cursor-pointer"
      >
        ←
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full cursor-pointer"
      >
        →
      </button>
    </div>
  );
}
