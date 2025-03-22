import { useState, useEffect } from "react";
import axios from "axios";

const Chat_area = ({ chatData }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const userId = localStorage.getItem("userId");
  const userProfileImage = localStorage.getItem("profileImage"); // User's own profile image filename

  useEffect(() => {
    if (!chatData?.roomId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/messages/${chatData.roomId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [chatData]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      await axios.post("http://localhost:3000/messages/send", {
        roomId: chatData.roomId,
        senderId: userId,
        receiverId: chatData.userId,
        message: input,
      });

      setMessages([
        ...messages,
        {
          sender: userId,
          message: input,
          createdAt: new Date().toISOString(),
          senderProfileImage: userProfileImage,
        },
      ]);
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header with Profile Image */}
      <div className="p-4 bg-white border-b flex items-center">
        <img
          src={chatData.profile_image ? `http://localhost:3000${chatData.profile_image}` : "/default-avatar.png"}
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <h2 className="text-lg font-semibold">{chatData.username || "Chat"}</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.sender === userId;
          return (
            <div key={index} className={`mb-3 flex items-center ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              {!isCurrentUser && (
                <img
                  src={chatData.profile_image ? `http://localhost:3000${chatData.profile_image}` : "/default-avatar.png"}
                  alt="Sender"
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div className={`max-w-xs p-3 rounded-lg shadow-md ${isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                <p>{msg.message}</p>
                <p className="text-xs text-gray-400 text-right">{new Date(msg.createdAt).toLocaleTimeString()}</p>
              </div>
              {isCurrentUser && (
                <img
                  src={userProfileImage ? `http://localhost:3000${userProfileImage}` : "/default-avatar.png"}
                  alt="You"
                  className="w-8 h-8 rounded-full ml-2"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Input Field */}
      <div className="p-4 border-t bg-white flex items-center">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat_area;