import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ClientCard1 = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

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

      const response = await axios.get("http://localhost:3000/getFriend", {
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

  // Pass the selected friend to the chat page
  const handleOpenChat = (friend) => {
    navigate("/chat", { state: { user: friend } }); 
  };

  return (
    <div className="space-y-2 bg-white">
      {friends.length > 0 ? (
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
                <span className="mt-1 mx-4">{friend.username}</span>
                <span className="mt-1 mx-4">{friend.email}</span>
              </div>
            </div>
            <button
              onClick={() => handleOpenChat(friend)} 
              className="bg-blue-700 text-white px-4 py-1 rounded-lg"
            >
              Message
            </button>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No connections found.</p>
      )}
    </div>
  );
};

export default ClientCard1;
