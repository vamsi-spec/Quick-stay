import React, { useEffect, useState } from "react";

const StartRating = ({ value = 0, onRate, disabled = false }) => {
  const [rating, setRating] = useState(value);

  const handlerating = (star) => {
    if (!disabled) {
      setRating(star);
      onRate?.(star);
    }
  };

  useEffect(() => {
    setRating(value);
  }, [value]);

  return (
    <div>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={`text-xl sm:text-2xl cursor-pointer transition-colors ${
              starValue <= rating ? "text-yellow-500" : "text-gray-500"
            }`}
            onClick={() => handlerating(starValue)}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default StartRating;
