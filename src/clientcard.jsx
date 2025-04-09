import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReviewCard from "./ReviewCard";
import { useNavigate } from "react-router-dom";

const ClientCard = ({ props }) => {
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkFriendRequestStatus = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await axios.get(
          `http://localhost:3000/checkFriendStatus`,
          {
            params: { userId, friendId: props.userId },
          }
        );

        if (response.data.isRequestSent) {
          setIsRequestSent(true);
        }
      } catch (error) {
        console.error("Error checking friend request status:", error);
      }
    };
    checkFriendRequestStatus();
  }, [props.userId]);

  const handleAddFriend = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("User not logged in.");
        return;
      }

      if (isRequestSent) {
        toast.info("Friend request already sent! ⏳");
        return;
      }

      const response = await axios.post("http://localhost:3000/friendReq", {
        userId,
        friendId: props.userId,
      });

      if (response.status === 200) {
        setIsRequestSent(true);
        toast.success("Friend request sent successfully! 🎉");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Request already sent. Please wait");
    }
  };
  const toggleReviews = async () => {
    if (showReview) {
      setShowReview(false);
      return;
    }

    try {
      setIsLoadingReviews(true);
      const response = await axios.get(`http://localhost:3000/get-reviews`, {
        params: { userId: props.userId },
      });

      setReviews(response.data);

      setShowReview(true); // Ensure reviews are shown after fetching
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleOpenChat = (friend) => {
    navigate("/chat", { state: { user: friend } });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 w-full hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <div className="relative w-20 h-20">
          <img
            src={`http://localhost:3000${props.profile_image}`}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/80";
            }}
          />
        </div>

        <button
          className={`bg-primary text-white text-sm px-4 py-2 rounded-md transition ${
            isRequestSent ? "cursor-not-allowed opacity-70" : "hover:bg-gray"
          }`}
          onClick={handleAddFriend}
          disabled={isRequestSent}
        >
          {isRequestSent ? "Following" : "Follow"}
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div className="mt-3 text-left">
          <h2 className="text-lg font-semibold text-gray-900">
            @{props.username}
          </h2>
          <p className="text-sm text-gray-500">{props.role}</p>
          <p className="text-sm text-gray-400">{props.email}</p>
        </div>
        <button
          onClick={() => handleOpenChat(props)}
          className="bg-primary text-white text-sm px-4 py-2 rounded-md transition hover:bg-blue-500"
        >
          Message
        </button>
      </div>

      {/* Toggle View Ratings */}
      <p
        className="pt-4 text-sm text-gray-500 underline hover:cursor-pointer"
        onClick={toggleReviews}
      >
        {showReview ? "Hide Ratings" : "View Ratings"}
        {isLoadingReviews && " (Loading...)"}
      </p>

      {/* Show ReviewCard when showReview is true */}
      {showReview && (
        <div className="mt-4">
          {console.log(Array.isArray(reviews))}
          {reviews.reviews.length > 0
            ? reviews.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            : !isLoadingReviews && (
                <p className="text-gray-500">No reviews available</p>
              )}
        </div>
      )}
    </div>
  );
};

export default ClientCard;
