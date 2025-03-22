import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "./assets/sidebar";
import Message_card from "./messagecard";
import Chat_area from "./chatarea";

const Messages = () => {
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const userId = localStorage.getItem("userId");
  const location = useLocation();

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/chat/${userId}`);
        console.log("Chat List Response:", res.data); // Log the response
        setChatList(res.data);
      } catch (err) {
        console.error("Error fetching chat rooms:", err);
      }
    };

    fetchChatList();
  }, [userId]);

  const openChat = async (receiver) => {
    try {
      const res = await axios.post("http://localhost:3000/chat/create-room", {
        senderId: userId,
        receiverId: receiver.userId,
      });

      // Fetch messages immediately after opening the chat
      const messagesRes = await axios.get(`http://localhost:3000/messages/${res.data.roomId}`);

      setSelectedChat({ ...receiver, roomId: res.data.roomId, messages: messagesRes.data });
    } catch (err) {
      console.error("Error opening chat:", err);
    }
  };

  // Automatically open chat if navigated from Pal_card.jsx
  useEffect(() => {
    if (location.state?.user) {
      openChat(location.state.user);
    }
  }, [location.state]);

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex">
        {/* Chat List */}
        <div className="w-1/3 bg-white p-4 border-r">
          <h2 className="text-2xl font-semibold mb-4">Messages</h2>
          {chatList.map((chat) => (
            <Message_card
              key={`${chat.roomId}-${chat.userId}`} // Unique key
              props={chat}
              onClick={() => openChat(chat)}
            />
          ))}
        </div>

        {/* Chat Area */}
        <div className="w-2/3">
          {selectedChat ? (
            <Chat_area chatData={selectedChat} />
          ) : (
            <p className="text-center mt-10 text-gray-500">Select a conversation</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;