import { Images } from "@/redux/features/product";
import { useAppSelector } from "@/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ImageOption from "./ImageOption";
import Confirmation from "../Confirmation";
import toast from "react-hot-toast";
import {
  useAddImageMutation,
  useDeleteImageMutation,
} from "@/redux/features/imageSlice";

interface GalleryProps {
  images: Images[];
  productId: string;
}

export default function ProductGallery({ images, productId }: GalleryProps) {
  const pathname = usePathname();
  const { roles } = useAppSelector((state) => state.auth);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isDashboard, setIsDashboard] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const [addImg] = useAddImageMutation();
  const [deleteImg] = useDeleteImageMutation();

  useEffect(() => {
    if (pathname.includes("dashboard") && roles.toString() === "ADMIN") {
      setIsDashboard(true);
      return;
    }
    setIsDashboard(false);
    return;
  }, [pathname]);

  const prevImage = async () => {
    await setDirection(1);
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = async () => {
    await setDirection(-1);
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const selectImage = async (index: number) => {
    if (index === selectedIndex) return;
    await setDirection(index > selectedIndex ? 1 : -1);
    setSelectedIndex(index);
  };

  if (!images.length) {
    return (
      <div className="w-full h-100 bg-gray-200 rounded-md flex items-center justify-center">
        No image
      </div>
    );
  }

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    e.preventDefault();

    try {
      const files = Array.from(e.target.files);

      const form = await new FormData();
      form.append("id", productId);
      files.forEach((image) => {
        form.append("images", image);
      });

      await addImg(form).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  const ConfirmDelete = async () => {
    try {
      if (!images[selectedIndex].id) return;

      const deletedImg = await deleteImg(images[selectedIndex].id).unwrap();
      setDeleteModalOpen(false);
      setSelectedIndex(0);
      toast.success("Successfully Deleted!");
    } catch (err) {
      console.log(err);
      toast.error("Delete Image Failed");
    }
  };
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Image */}
      <div className="group relative border border-gray-400 overflow-hidden rounded-md flex items-center justify-center h-80 lg:h-100">
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

        {/* Left Button */}
        <button
          onClick={prevImage}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/40 dark:hover:bg-black/50 dark:active:bg-black/60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow"
        >
          <ChevronLeft size={25} />
        </button>

        {/* Right Button */}
        <button
          onClick={nextImage}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/40 dark:hover:bg-black/50 dark:active:bg-black/60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow"
        >
          <ChevronRight size={25} />
        </button>

        {isDashboard && <ImageOption setDeleteModal={setDeleteModalOpen} />}
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center gap-3 mt-4">
        <AnimatePresence mode="sync">
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.5,
                y: -10,
              }}
              transition={{ duration: 0.3 }}
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
        </AnimatePresence>
        {isDashboard && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="shrink-0 w-14 h-14 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-green-500 text-xl cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300"
          >
            +
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleAddImage(e)}
      />

      {isDeleteModalOpen && (
        <Confirmation
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={ConfirmDelete}
          Purpose="Delete"
        />
      )}
    </div>
  );
}
