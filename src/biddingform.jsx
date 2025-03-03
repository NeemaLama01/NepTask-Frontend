import React, { useState } from 'react';

const BiddingFormOverlay = ({ onClose, onSubmit, priceRange }) => {
  const [offerPrice, setOfferPrice] = useState('');
  const [comments, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clean the priceRange string (remove unwanted prefixes like "NRs.")
    const cleanedPriceRange = priceRange.replace(/[^0-9-]/g, ''); // Remove non-numeric characters except "-"

    // Validate priceRange format
    if (!cleanedPriceRange || !cleanedPriceRange.includes('-')) {
      setError('Invalid price range format. Expected format: "minPrice-maxPrice".');
      return;
    }

    // Split the cleaned priceRange into minPrice and maxPrice
    const [minPriceStr, maxPriceStr] = cleanedPriceRange.split('-').map((str) => str.trim());
    const minPrice = parseFloat(minPriceStr);
    const maxPrice = parseFloat(maxPriceStr);

    // Check if minPrice and maxPrice are valid numbers
    if (isNaN(minPrice)) {
      setError('Invalid minimum price in the price range.');
      return;
    }

    if (isNaN(maxPrice)) {
      setError('Invalid maximum price in the price range.');
      return;
    }

    const parsedOfferPrice = parseFloat(offerPrice);

    // Check if offerPrice is a valid number
    if (isNaN(parsedOfferPrice)) {
      setError('Please enter a valid offer price.');
      return;
    }

    // Check if offerPrice is within the range
    if (parsedOfferPrice < minPrice || parsedOfferPrice > maxPrice) {
      setError(`Offer price must be between Rs. ${minPrice} and Rs. ${maxPrice}.`);
      return;
    }

    // Clear any previous errors
    setError('');

    // Pass the data to the parent component's onSubmit handler
    if (onSubmit) {
      onSubmit(parsedOfferPrice, comments);
    }
    onClose(); // Close the bidding form
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Bidding Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Offer Price</label>
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            {priceRange && (
              <p className="text-sm text-gray-500 mt-1">
                Price Range: Rs. {priceRange.replace(/\s+/g, '')}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              value={comments}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BiddingFormOverlay;