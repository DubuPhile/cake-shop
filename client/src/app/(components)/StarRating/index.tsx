import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  initialRating?: number;
  totalStars?: number;
  onChange?: (rating: number) => void;
  interactive?: boolean;
  style?: string;
};

export default function StarRating({
  initialRating = 0,
  totalStars = 5,
  onChange,
  interactive,
  style = "w-4 h-4",
}: Props) {
  const [rating, setRating] = useState(initialRating);
  const [hovered, setHovered] = useState<number | null>(null);

  const activeRating = interactive ? (hovered ?? rating) : rating;

  const handleRate = (value: number) => {
    if (!interactive) return;
    setRating(value);
    onChange?.(value);
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= activeRating;

        return (
          <motion.button
            key={index}
            type="button"
            disabled={!interactive}
            whileHover={interactive ? { scale: 1.2 } : {}}
            whileTap={interactive ? { scale: 0.85 } : {}}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
            onMouseEnter={() => interactive && setHovered(starValue)}
            onMouseLeave={() => interactive && setHovered(null)}
            onClick={() => handleRate(starValue)}
            className={`relative ${
              !interactive ? "cursor-default" : "cursor-pointer"
            }`}
          >
            <motion.div
              animate={{
                scale: isFilled ? 1.1 : 1,
                rotate: isFilled ? [0, -8, 8, 0] : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <Star
                className={`${style} transition-all duration-300 ${
                  isFilled
                    ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
                    : "text-gray-300"
                }`}
              />
            </motion.div>

            {/* glow effect */}
            {isFilled && (
              <motion.div
                layoutId="glow"
                className="absolute inset-0 rounded-full bg-yellow-300/30 blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
