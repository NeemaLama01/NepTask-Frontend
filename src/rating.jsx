
import React from "react";
import { RxCross2 } from "react-icons/rx";
const ReviewForm = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-12">
      {/* Cancel */}
      <div className="flex justify-end ">
      <button
      className="flex justify-end p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
      <RxCross2  className="w-5 h-5" />
    </button>
      </div>

      {/* Score Section */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Score:</label>
        <div className="flex mt-1">
          {[...Array(5)].map((_, index) => (
            <button key={index} className="text-yellow">
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Title Input */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Title:</label>
        <input
          type="text"
          placeholder="Enter title"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Review Textarea */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Review:</label>
        <textarea
          placeholder="Write your review"
          rows="4"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Post Button */}
      <div className="mt-6">
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Post
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;