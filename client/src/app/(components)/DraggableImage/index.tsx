"use client";

import { motion, useMotionValue } from "framer-motion";
import { ImageUp } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  setOffsetY: React.Dispatch<React.SetStateAction<number>>;
  setImgBanner: React.Dispatch<React.SetStateAction<File | undefined>>;
};

export function CoverEditor({ setOffsetY, setImgBanner }: Props) {
  const [image, setImage] = useState("");
  const [constraints, setConstraints] = useState({
    top: 0,
    bottom: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const y = useMotionValue(0);

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImgBanner(file);

    const url = URL.createObjectURL(file);

    setImage(url);

    y.set(0);
  };

  const onImageLoad = () => {
    if (!containerRef.current || !imageRef.current) return;

    const containerHeight = containerRef.current.clientHeight;
    const imageHeight = imageRef.current.clientHeight;

    const maxMove = Math.max(imageHeight - containerHeight, 0);

    setConstraints({
      top: -maxMove,
      bottom: 0,
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={uploadImage}
      />

      <div
        ref={containerRef}
        className="relative min-w-100 h-72 overflow-hidden rounded-lg border border-gray-300"
      >
        {!image && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h3 className="text-gray-500 font-semibold mb-3">Upload Image</h3>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="shrink-0 w-14 h-14 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-green-500 text-xl cursor-pointer"
            >
              <ImageUp />
            </button>
          </div>
        )}
        {image && (
          <motion.img
            ref={imageRef}
            src={image}
            onLoad={onImageLoad}
            draggable={false}
            drag="y"
            dragConstraints={constraints}
            dragElastic={0}
            dragMomentum={false}
            style={{
              y,
            }}
            onDragEnd={() => {
              console.log(y.get());
              setOffsetY(Math.round(y.get()));
            }}
            className="w-full cursor-grab select-none active:cursor-grabbing"
          />
        )}
      </div>
    </div>
  );
}
