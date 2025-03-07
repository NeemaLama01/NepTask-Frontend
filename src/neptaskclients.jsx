import React, { useEffect, useState } from "react";
import axios from "axios";

const Pal_card = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    getFriends(); // Fetch friends when component mounts
  }, []);

  const getFriends = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("No user ID found in localStorage.");
        return;
      }

      const response = await axios.get("http://localhost:3000/get-friend", {
        params: { userId },
      });

      console.log("API Response:", response.data);

      if (Array.isArray(response.data)) {
        setFriends(response.data);
      } else {
        console.error("Expected an array but got:", typeof response.data);
        setFriends([]);
      }
    } catch (error) {
      console.error("Error getting friends:", error);
      setFriends([]);
    }
  };

  // Define handleSendToFriend function
  const handleSendToFriend = (email) => {
    console.log(`Sending agreement to: ${email}`);
    // Add your sending logic here
  };

  return (
        <div className="space-y-2 bg-white">
          {Array.isArray(friends) && friends.length > 0 ? (
            friends.map((friend) => (
              <div
                key={friend.userId}
                className="flex justify-between items-center p-2 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center">
                  <img
                    src={`http://localhost:3000${friend.profile_image}`}
                    alt="Friend Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                  <span className="mt-1 mx-4">@{friend.username}</span>
                  <span className="mt-1 mx-4">@{friend.username}</span>
                  </div>

                </div>
                <button
                  onClick={() => handleSendToFriend(friend.email)}
                  className="bg-purple-600 text-white px-4 py-1 rounded-lg"
                >
                  Message
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No friends found.</p>
          )}
        </div>


  );
};

export default Pal_card;