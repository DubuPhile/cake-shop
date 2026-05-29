import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

type RatingProps = {
  rating: number;
};

export default function Rating({ rating }: RatingProps) {
  const roundRating = Math.round(rating);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((index) => (
        <FontAwesomeIcon
          key={index}
          icon={index <= roundRating ? solidStar : regularStar}
          className="w-4 h-4 text-yellow-400 drop-shadow-sm"
        />
      ))}
    </div>
  );
}
