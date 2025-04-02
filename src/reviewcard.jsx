import React from "react";

const ReviewCard = ({ review }) => {
  console.log(review); // Log to check the review object structure

  // Calculate average rating (although it's a single review here, you can calculate if needed)
  const averageRating = review.rating ? review.rating.toFixed(1) : 0;

  // Function to generate star icons based on rating
  const renderStars = (rating) => {
    return "⭐".repeat(Math.round(rating)); // Repeat star based on rounded rating
  };

  return (
    <div className="bg-gray-100 p-4 mt-2 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">Ratings & Reviews</h3>

      {/* Show the review's rating and stars */}
      <div className="flex items-center gap-2 mt-2">
        <p className="text-xl font-bold text-yellow-500">{averageRating}</p>
        <p className="text-lg text-yellow-500">{renderStars(averageRating)}</p>
      </div>

      {/* Display each review's content */}
      <div className="border-b border-gray-300 pb-2 mb-2">
        <p className="text-sm text-gray-600">"{review.review}"</p>
        <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p> {/* Formatted date */}
      </div>
    </div>
  );
};

export default ReviewCard;
