"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

type MultiImageUploadProps = {
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  images: string[];
};

export default function MultiImageUpload({
  setImages,
  images,
}: MultiImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    e.preventDefault();

    const files = Array.from(e.target.files);

    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...imageUrls]);

    // set first image as preview
    if (!selectedImage && imageUrls.length > 0) {
      setSelectedImage(imageUrls[0]);
    }
  };

  return (
    <div className="relative w-full md:w-87.5 rounded-xl bg-gray-100 p-4">
      <h2 className="font-semibold mb-4 w-full flex justify-center text-gray-700">
        Upload Image
      </h2>

      {/* Main Preview */}
      <div className="bg-gray-200 rounded-xl overflow-hidden w-full md:h-80 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {selectedImage ? (
            <motion.img
              key={selectedImage}
              src={selectedImage}
              alt="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-contain"
            />
          ) : (
            <p className="text-gray-400">No Image</p>
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnail List */}
      <div className="flex gap-2 mt-4 w-full md:w-[320px] overflow-auto">
        {images.map((img, index) => (
          <div key={index} className="relative">
            <button
              type="button"
              key={index}
              onClick={() => setSelectedImage(img)}
              onDoubleClick={() =>
                setImages((prev) => prev.filter((_, i) => i !== index))
              }
              className={`w-14 h-14 rounded-lg shrink-0 overflow-hidden border-2 ${
                selectedImage === img ? "border-red-400" : "border-gray-200"
              }`}
            >
              <img
                src={img}
                alt={`thumb-${index}`}
                className={`w-14 h-14 object-cover transition-all duration-300 overflow-hidden ${selectedImage === img ? "scale-150 blur-[1px]" : "scale-100"}`}
              />
            </button>
            {selectedImage === img && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();

                  setImages((prev) => prev.filter((_, i) => i !== index));
                }}
                className="absolute top-[40%] right-[40%] w-3 h-3 rounded-full bg-transparent text-red-500 flex items-center justify-center text-lg font-bold shadow"
              >
                −
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="shrink-0 w-14 h-14 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-green-500 text-xl"
        >
          +
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleUpload(e)}
      />
    </div>
  );
}
