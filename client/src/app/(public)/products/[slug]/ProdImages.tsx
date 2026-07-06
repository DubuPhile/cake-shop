import { Images } from "@/redux/features/product";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Props = {
  images: Images[];
};

export default function ProdImages({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const selectImage = async (index: number) => {
    if (index === selectedIndex) return;
    await setDirection(index > selectedIndex ? 1 : -1);
    setSelectedIndex(index);
  };

  const content = (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-md flex items-center justify-center h-80 lg:h-130  transition-all duration-300 mx-auto">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedIndex}
            src={images[selectedIndex].url}
            alt="Product"
            className="w-full h-full object-contain absolute inset-0"
            initial={{
              opacity: 0,
              x: direction > 0 ? 100 : -100,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: direction > 0 ? -100 : 100,
            }}
            transition={{
              duration: 0.3,
            }}
          />
        </AnimatePresence>
        {images.length > 1 && (
          <div className="absolute bottom-1">
            <div className="flex justify-center gap-3 mt-4">
              {images.map((img, index) => (
                <motion.div
                  key={img.id}
                  className="hover:scale-105 active:scale-100 transition-all duration-300"
                >
                  <button
                    onClick={() => selectImage(index)}
                    className={`border transition rounded-lg  ${
                      selectedIndex === index
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${index}`}
                      className="shrink-0 w-14 h-14 rounded-lg object-cover cursor-pointer"
                    />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  return content;
}
