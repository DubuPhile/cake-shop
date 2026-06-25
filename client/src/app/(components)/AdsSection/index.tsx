"use client";

import { useEffect, useState } from "react";
import Jill from "../../../../public/jill.jpg";
import Image, { StaticImageData } from "next/image";

type Ad = {
  id: number;
  title: string;
  description: string;
  image: string | StaticImageData;
};

export interface AdSection {
  ads: Ad[];
}

const ads: Ad[] = [
  {
    id: 3,
    title: "SUMMER SALE",
    description: "Up to 50% off selected items.",
    image: Jill,
  },
];

export default function AdSlider() {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === ads.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-50 sm:h-70 md:h-100 overflow-hidden rounded-3xl">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {ads.map((ad) => (
          <div key={ad.id} className="relative min-w-full h-full">
            {/* Background image */}
            <Image
              src={ad.image}
              alt={ad.title}
              fill
              className="object-cover object-top"
              loading="eager"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Content */}
            <div className="relative z-10 flex h-full items-center px-1 sm:px-12 transition-all duration-300 scale-70 -translate-x-10 sm:translate-x-0 sm:scale-100">
              <div className="max-w-sm md:max-w-lg text-white bg-black/50 p-5 rounded-2xl transition-all duration-300">
                <p className="text-xs md:text-sm uppercase tracking-widest">
                  New Product
                </p>

                <h1 className="text-md md:text-5xl font-bold mt-2 transition-all duration-300">
                  {ad.title}
                </h1>

                <p className="mt-4 text-xs md:text-lg text-gray-200 transition-all duration-300">
                  {ad.description}
                </p>

                <button className="mt-6 text-xs md:text-base bg-white text-black px-3 py-2 md:px-6 md:py-3 rounded-xl font-semibold hover:scale-105 transition cursor-pointer">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {ads.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              current === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
