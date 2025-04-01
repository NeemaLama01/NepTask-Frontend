import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";

const ReviewForm = ({ onClose, taskId }) => {
  // State to store the rating (number of stars)
  const [rating, setRating] = useState(0);  // Default is 0
  const [review, setReview] = useState("");
  const reviewer_id = localStorage.getItem("userId"); // Get reviewer ID from localStorage
  
  console.log("Task ID:", taskId);
  console.log("Reviewer ID:", reviewer_id);

  // Handle the rating change when a star is clicked
  const handleStarClick = (index) => {
    setRating(index + 1); // Rating is between 1 and 5 (inclusive)
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Ensure rating and review are provided before submitting
    if (rating === 0 || !review.trim()) {
      alert("Please provide a score and review before submitting.");
      return;
    }

    // Prepare data to send to the backend
    const data = {
      rating: rating, // Send the rating as a float (number)
      review: review,
      reviewer_id: reviewer_id,
      taskid: taskId,
    };

    try {
      // Send POST request with the review data
      const response = await axios.post('http://localhost:3000/reviews', data);
      console.log('Response from backend:', response);
      onClose(); // Close the review form after submission
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md mt-12 relative">
      {/* Cancel Button */}
      <div className="flex justify-end">
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 focus:outline-none">
          <RxCross2 className="w-5 h-5" />
        </button>
      </div>

      {/* Score Section */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Score:</label>
        <div className="flex mt-1">
          {[...Array(5)].map((_, index) => (
            <button
              key={index}
              className={`text-xl ${index < rating ? "text-yellow-500" : "text-gray-300"}`}
              onClick={() => handleStarClick(index)} // Update rating on star click
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Review Textarea */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Review:</label>
        <textarea
          placeholder="Write your review"
          rows="4"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={review}
          onChange={(e) => setReview(e.target.value)} // Update review text
        />
      </div>

      {/* Post Button */}
      <div className="mt-6">
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSubmit}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
