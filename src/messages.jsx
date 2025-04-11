import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "./assets/sidebar";
import Message_card from "./messagecard";
import Chat_area from "./chatarea";
import Subheader from "./assets/subheader"; 
import { AiOutlineMessage } from "react-icons/ai";

const Messages = () => {
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const userId = localStorage.getItem("userId");
  const location = useLocation();

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/chat/${userId}`);
        console.log("Chat List Response:", res.data);
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

      const messagesRes = await axios.get(
        `http://localhost:3000/messages/${res.data.roomId}`
      );
      setSelectedChat({
        ...receiver,
        roomId: res.data.roomId,
        messages: messagesRes.data,
      });
    } catch (err) {
      console.error("Error opening chat:", err);
    }
  };

  useEffect(() => {
    if (location.state?.user) {
      openChat(location.state.user);
    }
  }, [location.state]);

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary p-6">Messages</h1>
          </div>
          <div className="p-4 bg-gray-50">
            <Subheader />
          </div>
        </div>
        {/* Subheader */}

        {/* Main Chat Content */}
        <div className="flex flex-1">
          {/* Chat List */}
          <div className="w-1/3 bg-white p-4 border-r overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Messages
            </h2>
            {chatList.map((chat) => (
              <Message_card
                key={`${chat.roomId}-${chat.userId}`}
                props={chat}
                onClick={() => openChat(chat)}
              />
            ))}
          </div>

          {/* Chat Area */}
          <div className="w-2/3 p-4 bg-white">
            {selectedChat ? (
              <Chat_area chatData={selectedChat} />
            ) : (
              <div className="text-center mt-40 text-gray-500 text-lg flex flex-col items-center">
                  <AiOutlineMessage className="text-6xl mb-4 text-gray-400" />
                <p>Select a conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
