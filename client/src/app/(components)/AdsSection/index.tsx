"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { BannerForm } from "@/redux/features/bannerSlice";
import { useRouter } from "next/navigation";

type Props = {
  banner?: BannerForm[];
};

export default function AdSlider({ banner }: Props) {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  // Auto slide
  useEffect(() => {
    if (!banner?.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === banner.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [banner?.length]);

  return (
    <div className="relative w-full aspect-2100/700 md:aspect-2100/700 overflow-hidden rounded-3xl">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {banner?.map((ad, index) => (
          <div key={index} className="relative min-w-full h-full">
            {/* Background image */}
            {ad.image?.[0].url ? (
              <img
                src={ad.image[0].url}
                alt={ad.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                style={{
                  objectPosition: `center ${ad.offsetY}px`,
                }}
                loading="eager"
              />
            ) : (
              <div className="absolute w-full h-full flex items-center justify-center">
                <h3 className="font-semibold text-xs md:text-base">
                  NO PREVIEW IMAGE
                </h3>
              </div>
            )}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Content */}
            <div className="relative z-10 flex h-full items-center px-1 md:px-12 transition-all duration-300 scale-70 -translate-x-10 md:translate-x-0 md:scale-100">
              <div className="max-w-sm md:max-w-lg text-white bg-black/50 p-5 rounded-2xl transition-all duration-300">
                <p className="text-xs lg:text-sm uppercase tracking-widest">
                  {ad.endDate || ad.endDate
                    ? format(ad.startDate || "", "MMM dd,yyyy") +
                      " - " +
                      format(ad.endDate || "", "MMM dd,yyyy")
                    : ""}
                </p>

                <h1 className="text-md lg:text-2xl font-bold mt-1 transition-all duration-300">
                  {ad.title}
                </h1>

                <p className="mt-2 text-xs lg:text-lg text-gray-200 transition-all duration-300">
                  {ad.description}
                </p>

                <button
                  onClick={() => router.push(`${ad.link}`)}
                  className="mt-3 text-xs lg:text-base bg-white text-black px-3 py-2 md:px-6 md:py-3 rounded-xl font-semibold hover:scale-105 transition cursor-pointer"
                >
                  {ad.CTA ? ad.CTA : "Buy now"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {banner &&
          banner.length > 1 &&
          banner?.map((_, index) => (
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
