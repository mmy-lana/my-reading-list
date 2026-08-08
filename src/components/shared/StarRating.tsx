import React from "react";

interface StarRatingProps {
  score: number; // The score out of 10
  maxStars?: number; // Optional: Total number of stars (default is 5)
}

const StarRating: React.FC<StarRatingProps> = ({ score, maxStars = 5 }) => {
  // Calculate the filled stars based on the score
  const filledStars = (score / 10) * maxStars;
  const fullStars = Math.floor(filledStars); // Number of fully filled stars
  const partialStar = filledStars - fullStars; // Fractional part for the last star

  return (
    <div className="flex items-center space-x-1">
      {/* Render fully filled stars */}
      {[...Array(fullStars)].map((_, index) => (
        <span key={index} className="text-yellow-500">
          &#9733; {/* Fully filled star */}
        </span>
      ))}

      {/* Render partially filled star */}
      {partialStar > 0 && (
        <div className="relative inline-block">
          {/* Empty star background */}
          <span className="text-gray-300">&#9733;</span>
          {/* Partially filled star overlay */}
          <span
            className="absolute left-0 top-0 text-yellow-500 overflow-hidden"
            style={{ width: `${partialStar * 100}%` }}
          >
            &#9733;
          </span>
        </div>
      )}

      {/* Render remaining empty stars */}
      {[...Array(maxStars - fullStars - (partialStar > 0 ? 1 : 0))].map(
        (_, index) => (
          <span key={index} className="text-gray-300">
            &#9733; {/* Empty star */}
          </span>
        )
      )}

      {/* Display the fraction, e.g., 4.3/5 */}
      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
        {filledStars.toFixed(1)}/{maxStars}
      </span>
    </div>
  );
};

export default StarRating;
