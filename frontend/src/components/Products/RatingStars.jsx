import React from "react";
import { FiStar } from "react-icons/fi";

const RatingStars = ({ rating = 0, size = 16 }) => {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={size}
          className={
            star <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "text-gray-300"
          }
        />
      ))}

      <span className="ml-1 text-sm font-medium text-gray-600">
        {value.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingStars;